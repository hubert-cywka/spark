export const AlertPublisherServiceToken = Symbol("AlertPublisherService");

export interface IAlertPublisherService {
    onReminderAlertTriggered(email: string): Promise<void>;
}
