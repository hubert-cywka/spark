import { Inject, Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";

import { IBackgroundJob } from "@/common/events/services/interfaces/IBackground.job";
import { type IEventOutbox, EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";

const INTERVAL_IN_MS = 1000;

@Injectable()
export class OutboxProcessorJob implements IBackgroundJob {
    public constructor(@Inject(EventOutboxToken) private readonly outbox: IEventOutbox) {}

    @Interval(INTERVAL_IN_MS)
    public async execute() {
        await this.outbox.process();
    }
}
