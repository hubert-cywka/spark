export const AlertPublisherServiceToken = Symbol("AlertPublisherService");

export interface IAlertPublisherService {
    onReminderTriggered(tenantId: string, email: string): Promise<void>;
}
