import 'reflect-metadata';
import { container } from 'tsyringe';
import { logger } from '@infrastructure/logging/logger';
import { BullMQJobQueue } from '@infrastructure/queue/bullmq/job.queue';
import { InMemoryWebhookViolationRepository } from '@infrastructure/database/in-memory-violation.repository';
import { JobInspectionService } from '@application/services/job-inspection.service';

// Register QueueService port concrete implementation
container.registerSingleton<BullMQJobQueue>('QueueService', BullMQJobQueue);

// Register WebhookViolationRepository port concrete implementation
container.registerSingleton<InMemoryWebhookViolationRepository>('WebhookViolationRepository', InMemoryWebhookViolationRepository);

// Register JobInspectionService
container.registerSingleton<JobInspectionService>(JobInspectionService);

logger.info('📦 Dependency injection container initialized.');

export { container };
