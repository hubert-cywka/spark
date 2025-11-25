import { type IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const EventPublisherToken = Symbol("EventPublisher");

// TODO: Extract options
export interface IEventPublisher {
    publish(event: IntegrationEvent, options?: EventPublishOptions): Promise<void>;
    publishMany(events: IntegrationEvent[], options?: EventPublishOptions): Promise<void>;
    enqueue(event: IntegrationEvent, options?: EventPublishOptions): Promise<void>;
    enqueueMany(events: IntegrationEvent[], options?: EventPublishOptions): Promise<void>;
}

export type EventPublishOptions = {
    encrypt: boolean;
};
