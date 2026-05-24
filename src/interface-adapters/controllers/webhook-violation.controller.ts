import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { webhookViolationSchema } from '../validation/webhook-violation.schema';
import { ProcessViolationUseCase } from '@application/use-cases/process-violation.use-case';
import { logger } from '@infrastructure/logging/logger';

export class WebhookViolationController {
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🎮 [WebhookViolationController] Processing webhook request...');

      // 1. Zod parse body
      const validatedData = webhookViolationSchema.parse(req.body);

      // 2. Resolve Use Case
      const useCase = container.resolve(ProcessViolationUseCase);

      // 3. Execute Core Business Flow
      const result = await useCase.execute(validatedData);

      logger.info(`✅ [WebhookViolationController] Ingestion completed. ID: ${result.violationId}, Alert Scheduled: ${result.alertScheduled}`);

      res.status(202).json({
        status: 'success',
        message: 'Violation webhook processed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
