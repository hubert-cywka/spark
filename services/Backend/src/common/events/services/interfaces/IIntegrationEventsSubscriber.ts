import { IntegrationEventsConsumer } from "@/common/events/types";

export const IntegrationEventsSubscriberToken = Symbol("IntegrationEventsSubscriber");

export interface IIntegrationEventsSubscriber {
    listen(consumers: IntegrationEventsConsumer[]): Promise<void>;
}
