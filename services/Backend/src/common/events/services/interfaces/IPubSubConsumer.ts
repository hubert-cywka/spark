import { IntegrationEvent } from "@/common/events";

export const PubSubConsumerToken = Symbol("PubSubConsumer");

export interface IPubSubConsumer {
    listen(topics: string[], onEventReceived: OnEventReceivedHandler): Promise<void>;
}

export type OnEventReceivedHandler = (event: IntegrationEvent) => Promise<void>;
