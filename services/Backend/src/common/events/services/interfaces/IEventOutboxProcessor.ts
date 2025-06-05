import { type IEventsQueueSubscriber } from "@/common/events/services/interfaces/IEventsQueueSubscriber";

export const EventOutboxProcessorToken = Symbol("OutboxEventsProcessor");

export interface IEventOutboxProcessor extends IEventsQueueSubscriber {
    processPendingEvents(): Promise<void>;
}
