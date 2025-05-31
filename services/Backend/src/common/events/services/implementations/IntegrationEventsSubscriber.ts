import { Inject, Injectable } from "@nestjs/common";

import { type IEventInbox, EventInboxToken } from "@/common/events";
import { type IIntegrationEventsSubscriber } from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { type IPubSubConsumer, PubSubConsumerToken } from "@/common/events/services/interfaces/IPubSubConsumer";

@Injectable()
export class IntegrationEventsSubscriber<T = unknown> implements IIntegrationEventsSubscriber<T> {
    public constructor(
        @Inject(PubSubConsumerToken)
        private readonly consumer: IPubSubConsumer<T>,
        @Inject(EventInboxToken) private readonly inbox: IEventInbox
    ) {}

    public async listen(metadata: T): Promise<void> {
        await this.consumer.listen(metadata, async (event) => {
            await this.inbox.enqueue(event);
        });
    }
}
