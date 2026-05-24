import { ConnectionOptions } from 'bullmq';
import { env } from '@infrastructure/config/env.config';

export const redisConnection: ConnectionOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Critical requirement for BullMQ
};
