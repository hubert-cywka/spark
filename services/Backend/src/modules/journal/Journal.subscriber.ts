import { Inject, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";

import {
    type IEventInbox,
    EventInboxToken,
    IInboxEventHandler,
    InboxEventHandlersToken,
    IntegrationEvent,
    IntegrationEventTopics,
} from "@/common/events";
import { BaseEventSubscriber } from "@/common/events/services/implementations/BaseEvent.subscriber";
import { HydratePipe } from "@/common/pipes/Hydrate.pipe";

export class JournalSubscriber extends BaseEventSubscriber {
    public constructor(@Inject(EventInboxToken) inbox: IEventInbox, @Inject(InboxEventHandlersToken) handlers: IInboxEventHandler[]) {
        super(inbox, handlers, new Logger(JournalSubscriber.name));
    }

    @EventPattern([IntegrationEventTopics.account.registration.completed])
    private async onEventReceived(
        @Payload(new HydratePipe(IntegrationEvent)) event: IntegrationEvent,
        @Ctx() context: NatsJetStreamContext
    ) {
        await this.handleIncomingEvent(event, context);
    }
}
