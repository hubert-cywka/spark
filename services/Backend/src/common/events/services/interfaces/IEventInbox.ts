import { type IEventsQueueObserver } from "@/common/events/services/interfaces/IEventsQueueObserver";
import { type IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const EventInboxToken = Symbol("EventInbox");

export interface IEventInbox extends IEventsQueueObserver {
    enqueue(event: IntegrationEvent): Promise<void>;
}
