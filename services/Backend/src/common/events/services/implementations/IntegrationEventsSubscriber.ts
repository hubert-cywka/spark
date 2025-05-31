import { Inject, Injectable } from "@nestjs/common";

import { type IEventInbox, EventInboxToken } from "@/common/events";
import { type IIntegrationEventsSubscriber } from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { type IPubSubConsumer, PubSubConsumerToken } from "@/common/events/services/interfaces/IPubSubConsumer";

@Injectable()
export class IntegrationEventsSubscriber implements IIntegrationEventsSubscriber {
    public constructor(
        @Inject(PubSubConsumerToken)
        private readonly consumer: IPubSubConsumer,
        @Inject(EventInboxToken) private readonly inbox: IEventInbox
    ) {}

    public async listen(topics: string[]): Promise<void> {
        await this.consumer.listen(topics, async (event) => {
            await this.inbox.enqueue(event);
        });
    }
}
