import { IntegrationEvent } from "@/common/events";

export const PubSubConsumerToken = Symbol("PubSubConsumer");

export interface IPubSubConsumer {
    listen(topics: string[], onEventReceived: OnEventReceivedHandler): Promise<void>;
}

// TODO: Verify what happens when this fails
export type OnEventReceivedHandler = (event: IntegrationEvent) => Promise<void>;
