import { Queue, JobsOptions } from 'bullmq';
import { redisConnection } from '../connection';
import { logger } from '@infrastructure/logging/logger';

export abstract class BaseQueue<T = any> {
  protected queue: Queue<T>;

  constructor(public readonly queueName: string) {
    this.queue = new Queue<T>(queueName, {
      connection: redisConnection,
    });
    logger.info(`🤖 Queue "${queueName}" initialized.`);
  }

  public async getJob(id: string): Promise<any> {
    return await this.queue.getJob(id);
  }

  public async close(): Promise<void> {
    await this.queue.close();
  }
}
