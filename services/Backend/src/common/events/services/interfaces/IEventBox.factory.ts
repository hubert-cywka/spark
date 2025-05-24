import { IEventInboxOptions } from "@/common/events/services/interfaces/IEventInboxOptions";
import { type IEventOutboxOptions } from "@/common/events/services/interfaces/IEventOutboxOptions";

export const EventBoxFactoryToken = Symbol("EventBoxFactory");

export interface IEventBoxFactory {
    createOutboxOptions(context: string): IEventOutboxOptions;
    createInboxOptions(context: string): IEventInboxOptions;
}
