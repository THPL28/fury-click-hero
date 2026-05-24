import { injectable, inject } from 'tsyringe';
import { IQueueService } from '../services/queue.interface';
import { DispatchJobInputDto, DispatchJobOutputDto } from '../dtos/job.dto';
import { logger } from '@infrastructure/logging/logger';
import { AppException } from '@domain/exceptions/app.exception';

@injectable()
export class DispatchJobUseCase {
  constructor(
    @inject('QueueService')
    private readonly queueService: IQueueService
  ) {}

  public async execute(input: DispatchJobInputDto): Promise<DispatchJobOutputDto> {
    logger.info(`🎯 [UseCase] Executing DispatchJobUseCase for type: ${input.type}`);

    // Core business validation example
    if (!input.target.includes('@') && input.type === 'email') {
      throw new AppException('Target must be a valid email for email jobs', 400);
    }

    const jobId = await this.queueService.enqueue(input);

    return {
      jobId,
      queueName: 'job-dispatcher',
      status: 'enqueued',
    };
  }
}
