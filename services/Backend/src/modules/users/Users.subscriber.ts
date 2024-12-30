import { Controller, Inject, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Interval } from "@nestjs/schedule";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";

import { IInboxEventHandler, InboxEventHandlersToken, IntegrationEventTopics } from "@/common/events";
import { type IEventInbox, EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";
import { HydratePipe } from "@/common/pipes/Hydrate.pipe";

@Controller()
export class UsersSubscriber {
    private readonly logger = new Logger(UsersSubscriber.name);

    public constructor(
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[]
    ) {}

    @EventPattern([IntegrationEventTopics.account.registration.completed, IntegrationEventTopics.account.activation.completed])
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
