export const JobSchedulerToken = Symbol("JobSchedulerToken");

export interface IJobScheduler {
    schedulePending(): Promise<void>;
}
