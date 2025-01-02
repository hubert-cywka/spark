import { Controller, Inject, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Interval } from "@nestjs/schedule";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";

import {
    type IEventInbox,
    EventInboxToken,
    IInboxEventHandler,
    InboxEventHandlersToken,
    IntegrationEvent,
    IntegrationEventTopics,
} from "@/common/events";
import { HydratePipe } from "@/common/pipes/Hydrate.pipe";

const INBOX_PROCESSING_INTERVAL = 5000;

// TODO: There is some duplication in all pubsub subscribers
@Controller()
export class JournalSubscriber {
    private readonly logger = new Logger(JournalSubscriber.name);

    public constructor(
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[]
    ) {}

    @EventPattern([IntegrationEventTopics.account.registration.completed])
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
}
