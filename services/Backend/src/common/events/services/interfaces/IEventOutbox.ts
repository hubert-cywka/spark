import { type IEventsQueueObserver } from "@/common/events/services/interfaces/IEventsQueueObserver";
import { type IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const EventOutboxToken = Symbol("Outbox");

export interface IEventOutbox extends IEventsQueueObserver {
    enqueue(event: IntegrationEvent, options?: { encrypt: boolean }): Promise<void>;
    enqueueMany(events: IntegrationEvent[], options?: { encrypt: boolean }): Promise<void>;
}
