import { IntegrationEventLabel } from "@/common/events/types";

export const IntegrationEventsSubscriberToken = Symbol("IntegrationEventsSubscriber");

export interface IIntegrationEventsSubscriber {
    listen(events: IntegrationEventLabel[]): Promise<void>;
}
