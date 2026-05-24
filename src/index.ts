import 'reflect-metadata';
import '@infrastructure/di/container';
import { startHttpServer } from '@infrastructure/http/server';
import { logger } from '@infrastructure/logging/logger';

try {
  startHttpServer();
} catch (error) {
  logger.error('❌ Failed to start application:', error);
  process.exit(1);
}
