import { ConnectionOptions } from 'bullmq';
import { env } from '@infrastructure/config/env.config';

function createRedisConnection(): ConnectionOptions {
  if (env.REDIS_URL) {
    const redisUrl = new URL(env.REDIS_URL);

    return {
      host: redisUrl.hostname,
      port: Number(redisUrl.port || 6379),
      username: redisUrl.username || undefined,
      password: redisUrl.password || undefined,
      tls: redisUrl.protocol === 'rediss:' ? {} : undefined,
      maxRetriesPerRequest: null, // Critical requirement for BullMQ
    };
  }

  return {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // Critical requirement for BullMQ
  };
}

export const redisConnection: ConnectionOptions = createRedisConnection();
