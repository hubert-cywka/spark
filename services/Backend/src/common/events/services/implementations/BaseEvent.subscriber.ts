import { Controller, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { SkipThrottle } from "@nestjs/throttler";

import { type IEventInbox, type IInboxEventHandler } from "@/common/events";

const INBOX_PROCESSING_INTERVAL = 3000;

@Controller()
@SkipThrottle()
export abstract class BaseEventSubscriber {
    protected constructor(
        protected readonly inbox: IEventInbox,
        protected readonly handlers: IInboxEventHandler[],
        protected readonly logger: Logger
    ) {}

    @Interval(INBOX_PROCESSING_INTERVAL)
    protected async processInbox() {
        await this.inbox.process(this.handlers);
    }
}
