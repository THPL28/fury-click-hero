import { injectable } from 'tsyringe';
import { Job } from 'bullmq';
import axios, { AxiosError } from 'axios';
import { BaseWorker } from '@infrastructure/queue/bullmq/base.worker';
import { DispatchJobInputDto } from '@application/dtos/job.dto';
import { logger } from '@infrastructure/logging/logger';

export interface WorkerAxiosResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  attempts: number;
}

@injectable()
export class JobWorker extends BaseWorker<DispatchJobInputDto> {
  private readonly client = axios.create({
    timeout: 5000, // Strict 5-second timeout
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'FuryAPI-Worker/1.0.0',
    },
  });

  constructor() {
    super('job-dispatcher');
  }

  protected async handle(job: Job<DispatchJobInputDto>): Promise<void> {
    const { target, type, payload } = job.data;
    logger.info(`👷 [Worker] Processing job ${job.id} [Type: ${type}] targeting ${target}...`);

    // In a real system, the 'target' is the webhook HTTP URL we notify.
    // For local mock demonstration, if target is not a URL, we point to a mock endpoint.
    const url = target.startsWith('http') ? target : `http://127.0.0.1:3000/api/health`;

    try {
      const response = await this.executeRequestWithRetry(url, payload, 3);
      logger.info(`✅ [Worker] Axios dispatch successful for job ${job.id}. Status: ${response.statusCode}`);
    } catch (error: any) {
      logger.error(`❌ [Worker] Definitive failure for job ${job.id}: ${error.message}`);
      // Throwing error here propagates back to BullMQ to flag the job as failed
      throw error;
    }
  }

  /**
   * Resilient HTTP post execution with custom retries, timeouts, and 4xx/5xx isolation
   */
  private async executeRequestWithRetry(
    url: string,
    data: any,
    maxAttempts: number = 3
  ): Promise<WorkerAxiosResponse> {
    let attempt = 0;
    let delay = 1000; // Initial retry delay of 1 second

    while (attempt < maxAttempts) {
      attempt++;
      try {
        logger.info(`📡 [Axios] Sending POST to ${url} (Attempt ${attempt}/${maxAttempts})...`);
        
        const response = await this.client.post(url, data);

        return {
          success: true,
          statusCode: response.status,
          data: response.data,
          attempts: attempt,
        };

      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const status = axiosError.response?.status;

          logger.error(`⚠️ [Axios] Request failed on attempt ${attempt}/${maxAttempts}. Status code: ${status || 'No Response'}`);

          // 1. Isolation of 4xx Client Errors (Except 429 Rate Limit or 408 Timeout)
          if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
            logger.error(`🚨 [Axios] Non-recoverable 4xx Client Error (${status}) encountered. Aborting retries immediately.`);
            throw new Error(`Non-recoverable client error: ${status}. Data: ${JSON.stringify(axiosError.response?.data)}`);
          }

          // 2. Handling 5xx Server Errors, 429 Rate Limits, or network timeouts (transient errors)
          if (status && (status >= 500 || status === 429 || status === 408)) {
            logger.warn(`🌀 [Axios] Recoverable error (${status}) encountered. Eligible for retry.`);
          } else if (axiosError.code === 'ECONNABORTED') {
            logger.warn(`🕒 [Axios] Request timeout triggered (exceeded 5000ms limit). Eligible for retry.`);
          } else {
            logger.warn(`🔌 [Axios] Network/Socket connection error: ${axiosError.message}. Eligible for retry.`);
          }
        } else {
          logger.error(`❌ [Axios] Unexpected non-HTTP error: ${error.message}`);
          throw error;
        }

        // Check if we have attempts left
        if (attempt >= maxAttempts) {
          throw new Error(`Max HTTP attempts (${maxAttempts}) reached. Connection failed.`);
        }

        // Apply exponential backoff delay before next retry
        logger.info(`⏰ [Axios] Backing off. Waiting ${delay}ms before next attempt...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Double delay duration
      }
    }

    throw new Error('HTTP Request execution failed.');
  }
}
