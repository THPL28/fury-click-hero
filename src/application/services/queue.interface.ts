import { DispatchJobInputDto } from '../dtos/job.dto';

export interface IQueueService {
  enqueue(data: DispatchJobInputDto): Promise<string>;
}
