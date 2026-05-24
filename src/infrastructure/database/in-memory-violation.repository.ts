import { injectable } from 'tsyringe';
import { WebhookViolation } from '@domain/entities/webhook-violation.entity';
import { IWebhookViolationRepository } from '@application/repositories/webhook-violation.repository.interface';
import { logger } from '@infrastructure/logging/logger';

@injectable()
export class InMemoryWebhookViolationRepository implements IWebhookViolationRepository {
  private database: Map<string, WebhookViolation> = new Map();

  public async save(violation: WebhookViolation): Promise<void> {
    this.database.set(violation.violationId, violation);
    logger.debug(`🔋 [Repository] Violation ${violation.violationId} stored successfully in Memory DB.`);
  }

  public async findById(violationId: string): Promise<WebhookViolation | null> {
    const record = this.database.get(violationId);
    return record ? record : null;
  }

  public async findAll(): Promise<WebhookViolation[]> {
    return Array.from(this.database.values());
  }
}
