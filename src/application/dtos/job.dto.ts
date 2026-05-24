export interface DispatchJobInputDto {
  target: string;
  type: 'email' | 'notification' | 'report';
  payload: Record<string, any>;
}

export interface DispatchJobOutputDto {
  jobId: string;
  queueName: string;
  status: string;
}
