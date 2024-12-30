import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { Interval } from "@nestjs/schedule";

import { IInboxEventHandler, InboxEventHandlersToken, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type IEventInbox, EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";
import { HydratePipe } from "@/common/pipes/Hydrate.pipe";

@Controller()
export class IdentitySubscriber {
    private readonly logger = new Logger(IdentitySubscriber.name);

    public constructor(
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[]
    ) {}

    @EventPattern([IntegrationEventTopics.account.passwordUpdated])
    private async onEventReceived(@Payload(new HydratePipe(IntegrationEvent)) event: IntegrationEvent) {
        this.logger.log(event, `Received '${event.getTopic()}' event.`);
        await this.inbox.enqueue(event);
    }

    @Interval(5000)
    private async processInbox() {
        await this.inbox.process(this.handlers);
    }
}
