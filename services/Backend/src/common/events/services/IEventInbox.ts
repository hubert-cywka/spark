import type { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const EventInboxToken = Symbol("EventInbox");

export interface IEventInbox {
    enqueue(event: IntegrationEvent): Promise<void>;
}
