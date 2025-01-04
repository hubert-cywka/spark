import { Controller, Inject, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Cron, CronExpression, Interval } from "@nestjs/schedule";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import dayjs from "dayjs";

import { IInboxEventHandler, InboxEventHandlersToken, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type IEventInbox, EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";
import { HydratePipe } from "@/common/pipes/Hydrate.pipe";

const INBOX_PROCESSING_INTERVAL = 3000;

@Controller()
export class IdentitySubscriber {
    private readonly logger = new Logger(IdentitySubscriber.name);

    public constructor(
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[]
    ) {}

    @EventPattern([IntegrationEventTopics.account.password.updated])
    private async onEventReceived(
        @Payload(new HydratePipe(IntegrationEvent)) event: IntegrationEvent,
        @Ctx() context: NatsJetStreamContext
    ) {
        this.logger.log(event, `Received '${event.getTopic()}' event.`);
        await this.inbox.enqueue(event);
        context.message.ack();
    }

    @Interval(INBOX_PROCESSING_INTERVAL)
    private async processInbox() {
        await this.inbox.process(this.handlers);
    }

    @Cron(CronExpression.EVERY_DAY_AT_4AM)
    private async clearInbox() {
        const processedBefore = dayjs().subtract(7, "days").toDate();
        await this.inbox.clearProcessedEvents(processedBefore);
    }
}
