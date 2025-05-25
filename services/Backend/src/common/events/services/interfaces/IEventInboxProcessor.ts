import { type IInboxEventHandler } from "@/common/events";
import { type IEventsQueueSubscriber } from "@/common/events/services/interfaces/IEventsQueueSubscriber";

export const EventInboxProcessorToken = Symbol("InboxEventsProcessor");

export interface IEventInboxProcessor extends IEventsQueueSubscriber {
    processPendingEvents(options?: { tenantId?: string }): Promise<void>;
    setEventHandlers(handlers: IInboxEventHandler[]): void;
}
