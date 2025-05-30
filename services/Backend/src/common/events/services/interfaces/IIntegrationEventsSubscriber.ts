export const IntegrationEventsSubscriberToken = Symbol("IntegrationEventsSubscriber");

export interface IIntegrationEventsSubscriber<T> {
    listen(metadata: T): Promise<void>;
}
