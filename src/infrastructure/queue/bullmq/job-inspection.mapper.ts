import { Job } from 'bullmq';
import { JobInspectionDataDto, JobInspectionErrorDto, JobInspectionResultDto } from '@application/dtos/job-inspection.dto';

export class JobInspectionMapper {
  /**
   * Map BullMQ job status to normalized status
   */
  public static mapBullMQStatus(bullmqStatus: string): 'queued' | 'processing' | 'completed' | 'failed' | 'delayed' {
    const statusMap: Record<string, 'queued' | 'processing' | 'completed' | 'failed' | 'delayed'> = {
      'waiting': 'queued',
      'active': 'processing',
      'completed': 'completed',
      'failed': 'failed',
      'delayed': 'delayed',
    };

    return statusMap[bullmqStatus] || 'queued';
  }

  /**
   * Map BullMQ Job to JobInspectionDataDto
   */
  public static async toDomain(job: Job): Promise<JobInspectionDataDto> {
    const state = (await job.getState()) || 'unknown';
    const status = this.mapBullMQStatus(state);

    // Calculate processing time if available
    let processingTimeMs: number | undefined;
    if (job.processedOn && job.finishedOn) {
      processingTimeMs = job.finishedOn - job.processedOn;
    }

    const data: JobInspectionDataDto = {
      jobId: job.id || 'unknown',
      queue: job.queueName || 'unknown',
      status,
      attemptsMade: job.attemptsMade || 0,
      maxAttempts: job.opts?.attempts || 1,
      createdAt: job.timestamp ? new Date(job.timestamp).toISOString() : 'unknown',
    };

    // Add optional timestamps
    if (job.processedOn) {
      data.processedAt = new Date(job.processedOn).toISOString();
    }

    if (job.finishedOn) {
      data.finishedAt = new Date(job.finishedOn).toISOString();
    }

    // Add processing time if calculated
    if (processingTimeMs !== undefined) {
      data.processingTimeMs = processingTimeMs;
    }

    // Map result if job is completed
    if (status === 'completed' && job.returnvalue) {
      data.result = this.extractJobResult(job.returnvalue);
    }

    // Map error if job failed
    if (status === 'failed' && job.failedReason) {
      data.error = this.extractJobError(job.failedReason, job.stacktrace ?? undefined);
    }

    return data;
  }

  /**
   * Extract result from job return value
   */
  private static extractJobResult(returnvalue: any): any {
    if (typeof returnvalue === 'object' && returnvalue !== null) {
      return {
        provider: returnvalue.provider,
        statusCode: returnvalue.statusCode,
      };
    }

    return returnvalue;
  }

  /**
   * Extract error information from job failure
   */
  private static extractJobError(failedReason: string, stacktrace?: string[]): JobInspectionErrorDto {
    return {
      message: failedReason || 'Unknown error',
      failedReason: stacktrace?.[0] || failedReason,
    };
  }
}
