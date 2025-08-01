import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type DailyReminderTriggeredEventPayload = {
    account: {
        id: string;
    };
};

export class DailyReminderTriggeredEvent extends IntegrationEvent<DailyReminderTriggeredEventPayload> {
    public constructor(tenantId: string, payload: DailyReminderTriggeredEventPayload) {
        const topic = IntegrationEvents.alert.daily.reminder.triggered.topic;
        const subject = IntegrationEvents.alert.daily.reminder.triggered.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
