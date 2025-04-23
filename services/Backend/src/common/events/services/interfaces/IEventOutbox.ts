import type { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const EventOutboxToken = Symbol("Outbox");

export interface IEventOutbox {
    enqueue(event: IntegrationEvent): Promise<void>;
    processPendingEvents(): Promise<void>;
    clearProcessedEvents(processedBefore: Date): Promise<void>;
    clearTenantEvents(tenantId: string): Promise<void>;
}
