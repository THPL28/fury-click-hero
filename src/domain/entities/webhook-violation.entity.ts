export interface WebhookViolationProps {
  violationId: string;
  category: string;
  severity: string;
  occurredAt: string;
  reporter: string;
  target: {
    ip?: string;
    resourceId: string;
    userRef?: string;
  };
  metadata?: Record<string, any>;
  status?: 'open' | 'resolved' | 'escalated';
}

export class WebhookViolation {
  private props: Required<WebhookViolationProps>;

  constructor(props: WebhookViolationProps) {
    this.props = {
      ...props,
      metadata: props.metadata || {},
      status: props.status || 'open',
    };
  }

  // Getters
  public get violationId(): string { return this.props.violationId; }
  public get category(): string { return this.props.category; }
  public get severity(): string { return this.props.severity; }
  public get occurredAt(): string { return this.props.occurredAt; }
  public get reporter(): string { return this.props.reporter; }
  public get target() { return this.props.target; }
  public get metadata(): Record<string, any> { return this.props.metadata; }
  public get status(): 'open' | 'resolved' | 'escalated' { return this.props.status; }

  // Business logic rules
  public isHighRisk(): boolean {
    return this.props.severity === 'CRITICAL' || this.props.severity === 'HIGH';
  }

  public resolve(): void {
    if (this.props.status === 'resolved') {
      throw new Error('Violation is already resolved');
    }
    this.props.status = 'resolved';
  }

  public escalate(): void {
    if (this.props.status === 'resolved') {
      throw new Error('Resolved violations cannot be escalated');
    }
    this.props.status = 'escalated';
  }

  // Convert to plain object representation (DTO/Persistence map)
  public toJSON(): Required<WebhookViolationProps> {
    return { ...this.props };
  }
}
