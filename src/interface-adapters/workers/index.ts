import 'reflect-metadata';
import '@infrastructure/di/container';
import { container } from 'tsyringe';
import { JobWorker } from './job.worker';
import { logger } from '@infrastructure/logging/logger';

async function bootstrapWorkers() {
  logger.info('⚙️ Bootstrapping BullMQ Workers...');

  const jobWorker = container.resolve(JobWorker);
  jobWorker.start();

  logger.info('🚀 All workers are running and listening for jobs.');
}

bootstrapWorkers().catch((error) => {
  logger.error('❌ Worker process crash:', error);
  process.exit(1);
});
