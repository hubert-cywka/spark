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

// TODO: There is some duplication in all pubsub subscribers
@Controller()
export class MailSubscriber {
    private readonly logger = new Logger(MailSubscriber.name);

    public constructor(
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[]
    ) {}

    @EventPattern([
        IntegrationEventTopics.account.activation.requested,
        IntegrationEventTopics.account.password.resetRequested,
        IntegrationEventTopics.account.password.updated,
        IntegrationEventTopics.account.activation.completed,
    ])
    private async onEventReceived(
        @Payload(new HydratePipe(IntegrationEvent)) event: IntegrationEvent,
        @Ctx() context: NatsJetStreamContext
    ) {
        this.logger.log(event, `Received '${event.getTopic()}' event.`);
        await this.inbox.enqueue(event);
        context.message.ack();
    }

    @Interval(5000)
    private async processInbox() {
        await this.inbox.process(this.handlers);
    }
}
