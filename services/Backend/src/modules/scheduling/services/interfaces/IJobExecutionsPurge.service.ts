export const JobExecutionsPurgeServiceToken = Symbol("JobExecutionsPurgeService");

export interface IJobExecutionsPurgeService {
    purgeAllButNLatest(latestJobsToKeep: number): Promise<void>;
}
