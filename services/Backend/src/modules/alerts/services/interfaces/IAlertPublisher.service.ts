export const AlertPublisherServiceToken = Symbol("AlertPublisherService");

export interface IAlertPublisherService {
    onReminderTriggered(tenantId: string): Promise<void>;
}
