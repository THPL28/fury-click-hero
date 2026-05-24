import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { JobInspectionService } from '@application/services/job-inspection.service';
import { logger } from '@infrastructure/logging/logger';

export class JobInspectionController {
  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('🔍 [JobInspectionController] Processing job inspection request...');

      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        logger.warn('🔍 [JobInspectionController] Invalid or missing job ID');
        res.status(400).json({
          success: false,
          message: 'Job ID is required',
        });
        return;
      }

      // Resolve service dynamically via tsyringe container
      const service = container.resolve(JobInspectionService);

      // Execute service
      const result = await service.inspectJob(id);

      logger.info(`🔍 [JobInspectionController] Job inspection completed: ${id}`);

      // Return with appropriate status code
      const statusCode = result.success ? 200 : 404;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }
}
