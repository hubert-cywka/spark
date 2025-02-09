import { Controller, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { SkipThrottle } from "@nestjs/throttler";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";

import { type IEventInbox, type IInboxEventHandler, IntegrationEvent } from "@/common/events";

const INBOX_PROCESSING_INTERVAL = 3000;

@Controller()
@SkipThrottle()
export abstract class BaseEventSubscriber {
    protected constructor(
        protected readonly inbox: IEventInbox,
        protected readonly handlers: IInboxEventHandler[],
        protected readonly logger: Logger
    ) {}

    protected async handleIncomingEvent(event: IntegrationEvent, context: NatsJetStreamContext) {
        this.logger.log(event, `Received '${event.getTopic()}' event.`);
        await this.inbox.enqueue(event);
        context.message.ack();
    }

    @Interval(INBOX_PROCESSING_INTERVAL)
    protected async processInbox() {
        await this.inbox.process(this.handlers);
    }
}
