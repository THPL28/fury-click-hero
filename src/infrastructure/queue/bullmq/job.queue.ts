import { injectable } from 'tsyringe';
import { BaseQueue } from './base.queue';
import { IQueueService } from '@application/services/queue.interface';
import { DispatchJobInputDto } from '@application/dtos/job.dto';
import { logger } from '@infrastructure/logging/logger';
import crypto from 'crypto';

@injectable()
export class BullMQJobQueue extends BaseQueue<DispatchJobInputDto> implements IQueueService {
  constructor() {
    super('job-dispatcher');
  }

  public async enqueue(data: DispatchJobInputDto): Promise<string> {
    logger.info(`🔌 [QueueService] Enqueuing job in BullMQ for target: ${data.target}`);
    
    const jobName = `task-${data.type}`;
    
    // 1. Generate deterministic jobId using SHA-256 hash of properties
    const payloadString = JSON.stringify(data.payload || {});
    const deterministicId = crypto
      .createHash('sha256')
      .update(`${data.type}:${data.target}:${payloadString}`)
      .digest('hex');

    logger.debug(`🔌 [QueueService] Generated deterministic jobId: ${deterministicId}`);

    // 2. Add to queue with backoff retries and the deterministic jobId for deduplication
    const job = await this.queue.add(jobName, data, {
      jobId: deterministicId,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000, // Starts at 5000ms delay, doubling exponentially on failure
      },
    });

    return job.id || 'unknown';
  }
}

