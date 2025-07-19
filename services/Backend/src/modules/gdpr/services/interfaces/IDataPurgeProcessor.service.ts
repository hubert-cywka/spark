export const DataPurgeProcessorToken = Symbol("DataPurgeProcessor");

export interface IDataPurgeProcessor {
    processDataPurgePlans(): Promise<void>;
}
