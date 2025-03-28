import { Inject, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";

import { IInboxEventHandler, InboxEventHandlersToken, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { BaseEventSubscriber } from "@/common/events/services/implementations/BaseEvent.subscriber";
import { type IEventInbox, EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";
import { HydratePipe } from "@/common/pipes/Hydrate.pipe";

export class GdprSubscriber extends BaseEventSubscriber {
    public constructor(
        @Inject(EventInboxToken)
        inbox: IEventInbox,
        @Inject(InboxEventHandlersToken)
        handlers: IInboxEventHandler[]
    ) {
        super(inbox, handlers, new Logger(GdprSubscriber.name));
    }

    @EventPattern([
        IntegrationEventTopics.account.registration.completed,
        IntegrationEventTopics.account.removal.completed,
        IntegrationEventTopics.account.removal.requested,
    ])
    private async onEventReceived(
        @Payload(new HydratePipe(IntegrationEvent)) event: IntegrationEvent,
        @Ctx() context: NatsJetStreamContext
    ) {
        await this.handleIncomingEvent(event, context);
    }
}
