import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { DispatchJobUseCase } from '@application/use-cases/dispatch-job.use-case';
import { dispatchJobSchema } from '../validation/job.schema';
import { logger } from '@infrastructure/logging/logger';

export class JobController {
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🎮 [Controller] Processing job dispatch request...');

      // Validate request using Zod schema
      const validatedBody = dispatchJobSchema.parse(req.body);

      // Resolve the use-case dynamically via tsyringe container
      const useCase = container.resolve(DispatchJobUseCase);

      // Execute usecase
      const result = await useCase.execute(validatedBody);

      logger.info('🎮 [Controller] Job dispatched successfully.');
      res.status(202).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
