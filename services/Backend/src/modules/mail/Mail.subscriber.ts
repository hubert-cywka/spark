import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { Interval } from "@nestjs/schedule";

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
        IntegrationEventTopics.account.activationTokenRequested,
        IntegrationEventTopics.account.passwordResetRequested,
        IntegrationEventTopics.account.passwordUpdated,
        IntegrationEventTopics.account.activated,
    ])
    private async onEventReceived(@Payload(new HydratePipe(IntegrationEvent)) event: IntegrationEvent) {
        this.logger.log(event, `Received '${event.getTopic()}' event.`);
        await this.inbox.enqueue(event);
    }

    @Interval(5000)
    private async processInbox() {
        await this.inbox.process(this.handlers);
    }
}
