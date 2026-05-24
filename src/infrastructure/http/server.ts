import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { routes } from './routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from '@infrastructure/logging/logger';
import { env } from '@infrastructure/config/env.config';

export function createHttpServer() {
  const app = express();

  // Basic Security & CORS
  app.use(helmet());
  app.use(cors());

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Simple Request Logging Middleware
  app.use((req, res, next) => {
    logger.http(`[HTTP] ${req.method} ${req.url}`);
    next();
  });

  // Base API routes
  app.use('/api', routes);

  // Global Error Handler (must be registered last)
  app.use(errorHandler);

  return app;
}

export function startHttpServer() {
  const app = createHttpServer();
  const port = env.PORT;

  return app.listen(port, () => {
    logger.info(`🚀 HTTP Server running in "${env.NODE_ENV}" mode on port ${port}`);
  });
}
