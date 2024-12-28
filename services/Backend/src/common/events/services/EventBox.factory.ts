import { IEventInbox } from "@/common/events/services/IEventInbox";
import { type IEventOutbox } from "@/common/events/services/IEventOutbox";

export const EventBoxFactoryToken = Symbol("EventBoxFactory");

export interface EventBoxFactory {
    createOutbox(context?: string): IEventOutbox;
    createInbox(context?: string): IEventInbox;
}
