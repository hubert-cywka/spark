import { Inject, Injectable } from "@nestjs/common";

import { type IEventInbox, EventInboxToken } from "@/common/events";
import { type IIntegrationEventsSubscriber } from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { type IPubSubConsumer, PubSubConsumerToken } from "@/common/events/services/interfaces/IPubSubConsumer";
import { IntegrationEventsConsumer } from "@/common/events/types";
import { logger } from "@/lib/logger";

@Injectable()
export class IntegrationEventsSubscriber implements IIntegrationEventsSubscriber {
    public constructor(
        @Inject(PubSubConsumerToken) private readonly consumer: IPubSubConsumer,
        @Inject(EventInboxToken) private readonly inbox: IEventInbox
    ) {}

    public async listen(consumers: IntegrationEventsConsumer[]): Promise<void> {
        const inbox = this.inbox;

        await this.consumer.listen(consumers, async (event, ack, nack) => {
            try {
                logger.log(event, `Received '${event.getTopic()}' event.`);
                await inbox.enqueue(event);
                ack();
            } catch (error) {
                logger.log({ error }, "Couldn't enqueue event.");
                nack();
            }
        });
    }
}
