import { IntegrationEvent } from "@/common/events";

export const PubSubConsumerToken = Symbol("PubSubConsumer");

export interface IPubSubConsumer<T> {
    listen(metadata: T, onEventReceived: OnEventReceivedHandler): Promise<void>;
}

// TODO: Verify what happens when this fails
export type OnEventReceivedHandler = (event: IntegrationEvent) => Promise<void>;
