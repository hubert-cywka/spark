export type RemoveProcessedEventsOptions = {
    processedBefore?: Date;
};

export interface IIntegrationEventRepository<T> {
    removeProcessed(options: RemoveProcessedEventsOptions): Promise<void>;
    removeAll(): Promise<void>;

    countUnprocessed(): Promise<number>;
    getById(eventId: string): Promise<T | null>;
}
