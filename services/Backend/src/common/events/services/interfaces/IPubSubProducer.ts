import { IntegrationEvent } from "@/common/events";
import { PublishAck } from "@/common/events/types";

export const PubSubProducerToken = Symbol("PubSubProducer");

export interface IPubSubProducer {
    publish(event: IntegrationEvent): Promise<PublishAck>;
}
