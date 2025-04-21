import { ConsumerMessages } from "@nats-io/jetstream";

import { EventConsumer } from "@/common/events/types";

export const PubSubConsumerToken = Symbol("PubSubConsumer");

export interface IPubSubConsumer {
    subscribe(consumers: EventConsumer[]): Promise<Promise<ConsumerMessages>[]>;
}
