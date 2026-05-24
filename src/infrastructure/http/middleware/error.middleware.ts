import { Request, Response, NextFunction } from 'express';
import { logger } from '@infrastructure/logging/logger';
import { ZodError } from 'zod';
import { AppException } from '@domain/exceptions/app.exception';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(`[${req.method}] ${req.url} - Error: ${err.message}`);

  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'fail',
      error: 'Validation Error',
      details: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
    return;
  }

  if (err instanceof AppException) {
    res.status(err.statusCode).json({
      status: 'fail',
      error: err.name,
      message: err.message
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
}

