import { Inject } from "@nestjs/common";

import { type IEventPublisher, EventPublisherToken } from "@/common/events/services/interfaces/IEventPublisher";
import { DailyReminderTriggeredEvent } from "@/common/events/types/alert/DailyReminderTriggeredEvent";
import { IAlertEventsPublisher } from "@/modules/alerts/services/interfaces/IAlertEventsPublisher.service";

export class AlertEventsPublisher implements IAlertEventsPublisher {
    public constructor(
        @Inject(EventPublisherToken)
        private readonly publisher: IEventPublisher
    ) {}

    public async onReminderTriggered(tenantId: string) {
        await this.publisher.enqueue(
            new DailyReminderTriggeredEvent(tenantId, {
                account: { id: tenantId },
            })
        );
    }
}
