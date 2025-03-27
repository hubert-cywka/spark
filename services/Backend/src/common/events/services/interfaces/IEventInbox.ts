import { IInboxEventHandler } from "@/common/events";
import type { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const EventInboxToken = Symbol("EventInbox");

export interface IEventInbox {
    enqueue(event: IntegrationEvent): Promise<void>;
    process(handlers: IInboxEventHandler[]): Promise<void>;
    clearProcessedEvents(processedBefore: Date): Promise<void>;
    removeEvents(tenantId: string): Promise<void>;
}
