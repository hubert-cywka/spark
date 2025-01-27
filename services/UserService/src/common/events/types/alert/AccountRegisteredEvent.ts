import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type DailyReminderTriggeredEventPayload = {
    email: string;
};

export class DailyReminderTriggeredEvent extends IntegrationEvent<DailyReminderTriggeredEventPayload> {
    public constructor(payload: DailyReminderTriggeredEventPayload) {
        super(IntegrationEventTopics.alert.daily.reminder.triggered, payload);
    }
}
