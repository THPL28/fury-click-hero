export interface JobInspectionErrorDto {
  message: string;
  failedReason: string;
}

export interface JobInspectionDataDto {
  jobId: string;
  queue: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'delayed' | 'unknown';
  attemptsMade: number;
  maxAttempts: number;
  createdAt: string | null;
  processedAt?: string;
  finishedAt?: string;
  processingTimeMs?: number;
  result?: any;
  error?: JobInspectionErrorDto | null;
}

export interface JobInspectionResultDto extends JobInspectionDataDto {}

export interface JobInspectionResponseDto {
  success: boolean;
  data: JobInspectionDataDto;
}
