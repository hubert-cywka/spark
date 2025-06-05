import { IntegrationEvent, IntegrationEventTopics } from "@/common/events";

export type DailyReminderTriggeredEventPayload = {
    account: {
        id: string;
    };
};

export class DailyReminderTriggeredEvent extends IntegrationEvent<DailyReminderTriggeredEventPayload> {
    public constructor(tenantId: string, payload: DailyReminderTriggeredEventPayload) {
        super({
            topic: IntegrationEventTopics.alert.daily.reminder.triggered,
            payload,
            partitionKey: tenantId,
            tenantId,
        });
    }
}
