export const DataPurgeServiceToken = Symbol("DataPurgeService");

export interface IDataPurgeService {
    scheduleForTenant(id: string): Promise<void>;
    cancelForTenant(id: string): Promise<void>;
}
