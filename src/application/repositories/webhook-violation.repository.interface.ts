import { WebhookViolation } from '@domain/entities/webhook-violation.entity';

export interface IWebhookViolationRepository {
  save(violation: WebhookViolation): Promise<void>;
  findById(violationId: string): Promise<WebhookViolation | null>;
  findAll(): Promise<WebhookViolation[]>;
}
