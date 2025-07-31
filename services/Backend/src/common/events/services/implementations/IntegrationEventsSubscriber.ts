import { Inject, Injectable } from "@nestjs/common";

import { type IEventInbox, EventInboxToken } from "@/common/events";
import { type IEventConsumer, EventConsumerToken } from "@/common/events/drivers/interfaces/IEventConsumer";
import { type IIntegrationEventsSubscriber } from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { IntegrationEventLabel } from "@/common/events/types";

@Injectable()
export class IntegrationEventsSubscriber implements IIntegrationEventsSubscriber {
    public constructor(
        @Inject(EventConsumerToken)
        private readonly consumer: IEventConsumer,
        @Inject(EventInboxToken) private readonly inbox: IEventInbox
    ) {}

    public async listen(events: IntegrationEventLabel[]): Promise<void> {
        await this.consumer.listen(events, async (events) => {
            await this.inbox.enqueueMany(events);
        });
    }
}
