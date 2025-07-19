export const DataPurgeSchedulerToken = Symbol("DataPurgeScheduler");

export interface IDataPurgeScheduler {
    scheduleForTenant(id: string): Promise<void>;
    cancelForTenant(id: string): Promise<void>;
}
