import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type DailyReminderTriggeredEventPayload = {
    email: string;
};

export class DailyReminderTriggeredEvent extends IntegrationEvent<DailyReminderTriggeredEventPayload> {
    public constructor(tenantId: string, payload: DailyReminderTriggeredEventPayload) {
        super(tenantId, IntegrationEventTopics.alert.daily.reminder.triggered, payload);
    }
}
