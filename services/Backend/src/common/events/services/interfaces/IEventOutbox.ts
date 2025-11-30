import { type IEventsQueueObserver } from "@/common/events/services/interfaces/IEventsQueueObserver";
import { type IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const EventOutboxToken = Symbol("Outbox");

export interface IEventOutbox extends IEventsQueueObserver {
    enqueue(event: IntegrationEvent): Promise<void>;
    enqueueMany(events: IntegrationEvent[]): Promise<void>;
}
