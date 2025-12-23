import { PublishAck } from "@/common/events/types";
import { type IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const EventPublisherToken = Symbol("EventPublisher");

export interface IEventPublisher {
    publish(event: IntegrationEvent, options?: EventPublishOptions): Promise<PublishAck>;
    publishMany(events: IntegrationEvent[], options?: EventPublishOptions): Promise<PublishAck>;
    enqueue(event: IntegrationEvent, options?: EventPublishOptions): Promise<void>;
    enqueueMany(events: IntegrationEvent[], options?: EventPublishOptions): Promise<void>;
}

export type EventPublishOptions = {
    encrypt: boolean;
};
