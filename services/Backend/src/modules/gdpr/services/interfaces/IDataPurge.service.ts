export const DataPurgeServiceToken = Symbol("DataPurgeService");

export interface IDataPurgeService {
    scheduleForTenant(id: string, removeAt: Date): Promise<void>;
    cancelForTenant(id: string): Promise<void>;
}
