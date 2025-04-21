import { ConsumerMessages } from "@nats-io/jetstream";
import { PubAck } from "nats";
import { Observable } from "rxjs";

import { IntegrationEvent } from "@/common/events";
import { EventConsumer } from "@/common/events/types";

export const PubSubClientToken = Symbol("PubSubClient");

export interface IPubSubClient {
    publish(event: IntegrationEvent): Observable<PubAck>;
    subscribe(consumers: EventConsumer[]): Promise<Promise<ConsumerMessages>[]>;
}
