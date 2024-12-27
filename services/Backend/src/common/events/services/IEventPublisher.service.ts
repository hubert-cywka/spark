import type { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const IEventPublisherServiceToken = Symbol("IEventPublisherServiceToken");

export interface IEventPublisherService {
    publish(event: IntegrationEvent): void;
}
