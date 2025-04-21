import { PubAck } from "nats";
import { Observable } from "rxjs";

import { IntegrationEvent } from "@/common/events";

export const PubSubProducerToken = Symbol("PubSubProducer");

export interface IPubSubProducer {
    publish(event: IntegrationEvent): Observable<PubAck>;
}
