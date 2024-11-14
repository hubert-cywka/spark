import type { DomainEvent } from "@/common/events/types/DomainEvent";

export const IPublisherServiceToken = Symbol("IPublisherServiceToken");

export interface IPublisherService {
    publish(event: DomainEvent): void;
}
