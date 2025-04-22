import { Inject, Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";

import { type IEventInbox, EventInboxToken, IInboxEventHandler, InboxEventHandlersToken } from "@/common/events";
import { IBackgroundJob } from "@/common/events/services/interfaces/IBackground.job";

const INTERVAL_IN_MS = 1000;

@Injectable()
export class InboxProcessorJob implements IBackgroundJob {
    public constructor(
        @Inject(EventInboxToken) protected readonly inbox: IEventInbox,
        @Inject(InboxEventHandlersToken) protected readonly handlers: IInboxEventHandler[]
    ) {}

    @Interval(INTERVAL_IN_MS)
    public async execute() {
        await this.inbox.process(this.handlers);
    }
}
