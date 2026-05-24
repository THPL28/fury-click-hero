import { injectable, inject } from 'tsyringe';
import { logger } from '@infrastructure/logging/logger';
import { BullMQJobQueue } from '@infrastructure/queue/bullmq/job.queue';
import { JobInspectionMapper } from '@infrastructure/queue/bullmq/job-inspection.mapper';
import { JobInspectionResponseDto } from '@application/dtos/job-inspection.dto';

@injectable()
export class JobInspectionService {
  constructor(
    @inject('QueueService') private readonly queueService: BullMQJobQueue,
  ) {}

  /**
   * Inspect a job by its ID
   */
  public async inspectJob(jobId: string): Promise<JobInspectionResponseDto> {
    try {
      logger.info(`📊 [JobInspectionService] Inspecting job: ${jobId}`);

      // Retrieve job from queue
      const job = await this.queueService.getJob(jobId);

      if (!job) {
        logger.warn(`📊 [JobInspectionService] Job not found: ${jobId}`);
        return {
          success: false,
          data: {
            jobId,
            queue: 'unknown',
            status: 'failed',
            attemptsMade: 0,
            maxAttempts: 0,
            createdAt: new Date().toISOString(),
            error: {
              message: `Job with ID "${jobId}" not found`,
              failedReason: 'Job not found in queue',
            },
          },
        };
      }

      // Map BullMQ job to domain model
      const jobData = await JobInspectionMapper.toDomain(job);

      logger.info(`📊 [JobInspectionService] Job inspected successfully: ${jobId} (status: ${jobData.status})`);

      return {
        success: true,
        data: jobData,
      };
    } catch (error) {
      logger.error(`📊 [JobInspectionService] Error inspecting job: ${jobId}`, error);

      return {
        success: false,
        data: {
          jobId,
          queue: 'unknown',
          status: 'failed',
          attemptsMade: 0,
          maxAttempts: 0,
          createdAt: new Date().toISOString(),
          error: {
            message: error instanceof Error ? error.message : 'Internal error',
            failedReason: 'Failed to inspect job',
          },
        },
      };
    }
  }
}
