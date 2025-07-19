import { Inject } from "@nestjs/common";

import { type IEventOutbox, EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { DailyReminderTriggeredEvent } from "@/common/events/types/alert/DailyReminderTriggeredEvent";
import { IAlertEventsPublisher } from "@/modules/alerts/services/interfaces/IAlertEventsPublisher.service";

export class AlertEventsPublisher implements IAlertEventsPublisher {
    public constructor(
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public async onReminderTriggered(tenantId: string) {
        await this.outbox.enqueue(
            new DailyReminderTriggeredEvent(tenantId, {
                account: { id: tenantId },
            })
        );
    }
}
