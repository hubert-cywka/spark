export const IntegrationEventsSubscriberToken = Symbol("IntegrationEventsSubscriber");

export interface IIntegrationEventsSubscriber {
    listen(topics: string[]): Promise<void>;
}
