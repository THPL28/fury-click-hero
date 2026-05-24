import { Worker, Job } from 'bullmq';
import { redisConnection } from '../connection';
import { logger } from '@infrastructure/logging/logger';

export abstract class BaseWorker<T = any> {
  protected worker!: Worker<T>;

  constructor(public readonly queueName: string) {}

  public start(): void {
    this.worker = new Worker<T>(
      this.queueName,
      async (job: Job<T>) => {
        logger.info(`🔄 Processing job "${job.name}" (${job.id}) in queue "${this.queueName}"...`);
        await this.handle(job);
        logger.info(`✅ Job "${job.name}" (${job.id}) in queue "${this.queueName}" completed.`);
      },
      {
        connection: redisConnection,
      }
    );

    this.worker.on('failed', (job, err) => {
      logger.error(`❌ Job "${job?.name}" (${job?.id}) in queue "${this.queueName}" failed: ${err.message}`);
    });

    logger.info(`⚙️ Worker for queue "${this.queueName}" started.`);
  }

  protected abstract handle(job: Job<T>): Promise<void>;

  public async close(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
    }
  }
}
