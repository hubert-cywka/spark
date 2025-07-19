export const AlertPublisherServiceToken = Symbol("AlertPublisherService");

export interface IAlertPublisher {
    onReminderTriggered(tenantId: string): Promise<void>;
}
