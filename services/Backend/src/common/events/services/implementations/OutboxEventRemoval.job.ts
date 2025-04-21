import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import dayjs from "dayjs";

import { type IEventOutbox, EventOutboxToken } from "@/common/events";
import { IBackgroundJob } from "@/common/events/services/interfaces/IBackground.job";

const EVENTS_RETENTION_PERIOD_IN_DAYS = 7;

@Injectable()
export class OutboxEventsRemovalJob implements IBackgroundJob {
    public constructor(@Inject(EventOutboxToken) private readonly outbox: IEventOutbox) {}

    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    public async execute() {
        const processedBefore = dayjs().subtract(EVENTS_RETENTION_PERIOD_IN_DAYS, "days").toDate();
        await this.outbox.clearProcessedEvents(processedBefore);
    }
}
