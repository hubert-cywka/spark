import { IntegrationEvent } from "@/common/events";

export interface IEventsQueueSubscriber {
    notifyOnEnqueued(event: IntegrationEvent): void;
}
