import { IntegrationEvent } from "@/common/events";

export const getPubSubConsumerToken = (context: string) => Symbol(context + "_PubSubConsumer");

export interface IPubSubConsumer<T> {
    listen(metadata: T, onEventReceived: OnEventReceivedHandler): Promise<void>;
}

export type OnEventReceivedHandler = (event: IntegrationEvent, ack?: () => void, nack?: () => void) => Promise<void>;
