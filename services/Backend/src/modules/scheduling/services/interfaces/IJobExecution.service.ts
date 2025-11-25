
export const JobExecutionServiceToken = Symbol("JobExecutionService");

export interface IJobExecutionService {
    executePending(): Promise<void>;
}
