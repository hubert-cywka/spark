export const AlertPublisherToken = Symbol("AlertPublisher");

export interface IAlertPublisher {
    onReminderTriggered(tenantId: string): Promise<void>;
}
