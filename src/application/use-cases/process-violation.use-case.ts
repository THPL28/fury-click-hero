import { injectable, inject } from 'tsyringe';
import { WebhookViolation, WebhookViolationProps } from '@domain/entities/webhook-violation.entity';
import { IWebhookViolationRepository } from '../repositories/webhook-violation.repository.interface';
import { IQueueService } from '../services/queue.interface';
import { logger } from '@infrastructure/logging/logger';

export interface ProcessViolationOutput {
  violationId: string;
  category: string;
  severity: string;
  status: string;
  alertScheduled: boolean;
}

@injectable()
export class ProcessViolationUseCase {
  constructor(
    @inject('WebhookViolationRepository')
    private readonly violationRepository: IWebhookViolationRepository,
    
    @inject('QueueService')
    private readonly queueService: IQueueService
  ) {}

  public async execute(input: WebhookViolationProps): Promise<ProcessViolationOutput> {
    logger.info(`🎯 [UseCase] Processing violation payload with ID: ${input.violationId}`);

    // 1. Create domain Entity (instantiation validates rules and formats)
    const violation = new WebhookViolation(input);

    // 2. Persist in database
    await this.violationRepository.save(violation);
    logger.info(`💾 [UseCase] Saved violation "${violation.violationId}" into repository.`);

    let alertScheduled = false;

    // 3. High risk workflow check
    if (violation.isHighRisk()) {
      logger.warn(`⚠️ [UseCase] High risk violation detected! Scheduling alert for target: ${violation.target.resourceId}`);
      
      // Enqueue job via application queue service interface
      await this.queueService.enqueue({
        target: violation.reporter,
        type: 'email',
        payload: {
          violationId: violation.violationId,
          severity: violation.severity,
          category: violation.category,
          resourceId: violation.target.resourceId,
        },
      });

      alertScheduled = true;
    }

    return {
      violationId: violation.violationId,
      category: violation.category,
      severity: violation.severity,
      status: violation.status,
      alertScheduled,
    };
  }
}
