export const AlertPublisherServiceToken = Symbol("AlertPublisherService");

export interface IAlertPublisherService {
    onReminderTriggered(email: string): Promise<void>;
}
