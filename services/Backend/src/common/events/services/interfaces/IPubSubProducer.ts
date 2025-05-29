import { IntegrationEvent } from "@/common/events";
import { PublishAck } from "@/common/events/types";

export const getPubSubProducerToken = (context: string) => Symbol(context + "_PubSubProducer");

export interface IPubSubProducer {
    publish(event: IntegrationEvent): Promise<PublishAck>;
}
