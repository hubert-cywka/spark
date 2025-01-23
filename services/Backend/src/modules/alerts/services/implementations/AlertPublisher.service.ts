import { Inject } from "@nestjs/common";

import { type IEventOutbox, EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { DailyReminderTriggeredEvent } from "@/common/events/types/alert/AccountRegisteredEvent";
import { IAlertPublisherService } from "@/modules/alerts/services/interfaces/IAlertPublisher.service";

export class AlertPublisherService implements IAlertPublisherService {
    public constructor(
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public async onReminderAlertTriggered(email: string) {
        await this.outbox.enqueue(new DailyReminderTriggeredEvent({ email }));
    }
}
