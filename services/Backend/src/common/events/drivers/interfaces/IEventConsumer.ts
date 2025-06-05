import { IntegrationEvent } from "@/common/events";

export const EventConsumerToken = Symbol("EventConsumerToken");

export interface IEventConsumer {
    listen(topics: string[], onEventReceived: OnEventsReceivedHandler): Promise<void>;
}

export type OnEventsReceivedHandler = (event: IntegrationEvent[]) => Promise<void>;
