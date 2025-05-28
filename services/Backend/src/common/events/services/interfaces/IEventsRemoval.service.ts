export const InboxEventsRemovalServiceToken = Symbol("InboxEventsRemovalServiceToken");
export const OutboxEventsRemovalServiceToken = Symbol("OutboxEventsRemovalServiceToken");

export interface IEventsRemovalService {
    removeProcessedBefore(processedBefore: Date): Promise<void>;
    removeByTenant(tenantId: string): Promise<void>;
}
