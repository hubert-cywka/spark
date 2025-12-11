export const AlertEventsPublisherToken = Symbol("AlertEventsPublisher");

export interface IAlertEventsPublisher {
    onReminderTriggered(tenantId: string): Promise<void>;
    onRemindersTriggered(tenantIds: string[]): Promise<void>;
}
