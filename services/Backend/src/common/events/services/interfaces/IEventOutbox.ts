import { type IEventsQueueObserver } from "@/common/events/services/interfaces/IEventsQueueObserver";
import { type IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const EventOutboxToken = Symbol("Outbox");

export interface IEventOutbox extends IEventsQueueObserver {
    enqueue(event: IntegrationEvent, options?: { encrypt: boolean }): Promise<void>;
    clearProcessedEvents(processedBefore: Date): Promise<void>;
    clearTenantEvents(tenantId: string): Promise<void>;
}
