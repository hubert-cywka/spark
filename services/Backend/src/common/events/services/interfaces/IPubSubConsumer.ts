import { IntegrationEvent } from "@/common/events";

export const PubSubConsumerToken = Symbol("PubSubConsumer");

export interface IPubSubConsumer {
    listen(topics: string[], onEventReceived: OnEventsReceivedHandler): Promise<void>;
}

export type OnEventsReceivedHandler = (event: IntegrationEvent[]) => Promise<void>;
