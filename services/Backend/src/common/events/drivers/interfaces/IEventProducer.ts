import { IntegrationEvent } from "@/common/events";
import { PublishAck } from "@/common/events/types";

export const EventProducerToken = Symbol("EventProducerToken");

export interface IEventProducer {
    publish(event: IntegrationEvent): Promise<PublishAck>;
    publishBatch(events: IntegrationEvent[]): Promise<PublishAck>;
}
