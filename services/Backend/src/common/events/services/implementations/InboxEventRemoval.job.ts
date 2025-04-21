import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import dayjs from "dayjs";

import { type IEventInbox, EventInboxToken } from "@/common/events";
import { IBackgroundJob } from "@/common/events/services/interfaces/IBackground.job";

const EVENTS_RETENTION_PERIOD_IN_DAYS = 7;

@Injectable()
export class InboxEventsRemovalJob implements IBackgroundJob {
    public constructor(@Inject(EventInboxToken) private readonly inbox: IEventInbox) {}

    @Cron(CronExpression.EVERY_DAY_AT_4AM)
    public async execute() {
        const processedBefore = dayjs().subtract(EVENTS_RETENTION_PERIOD_IN_DAYS, "days").toDate();
        await this.inbox.clearProcessedEvents(processedBefore);
    }
}
