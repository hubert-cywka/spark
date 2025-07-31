import { IntegrationEvent } from "@/common/events";
import { IntegrationEventLabel } from "@/common/events/types";

export const EventConsumerToken = Symbol("EventConsumerToken");

export interface IEventConsumer {
    listen(events: IntegrationEventLabel[], onEventReceived: OnEventsReceivedHandler): Promise<void>;
}

export type OnEventsReceivedHandler = (event: IntegrationEvent[]) => Promise<void>;
