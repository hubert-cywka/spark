import { IntegrationEvent } from "@/common/events";
import { IntegrationEventsConsumer } from "@/common/events/types";

export const PubSubConsumerToken = Symbol("PubSubConsumer");

export interface IPubSubConsumer {
    listen(consumers: IntegrationEventsConsumer[], onEventReceived: OnEventReceivedHandler): Promise<void>;
}

export type OnEventReceivedHandler = (event: IntegrationEvent, ack: () => void, nack: () => void) => Promise<void>;
