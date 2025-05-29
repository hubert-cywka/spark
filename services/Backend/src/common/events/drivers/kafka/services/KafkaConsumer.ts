import { Injectable, Logger } from "@nestjs/common";
import { type Consumer } from "kafkajs";

import { IntegrationEvent } from "@/common/events";
import { type IPubSubConsumer, OnEventReceivedHandler } from "@/common/events/services/interfaces/IPubSubConsumer";

@Injectable()
export class KafkaConsumer implements IPubSubConsumer<KafkaConsumerMetadata> {
    private readonly logger = new Logger(KafkaConsumer.name);

    public constructor(private readonly consumer: Consumer) {}

    public async listen(metadata: KafkaConsumerMetadata, onEventReceived: OnEventReceivedHandler): Promise<void> {
        await this.consumer.subscribe(metadata);
        this.logger.log({ topics: metadata.topics }, "Subscribed to topics.");

        await this.consumer.run({
            eachMessage: async ({ message, topic }) => {
                if (!message.value) {
                    this.logger.warn({ message, topic }, "Received empty message.");
                    return;
                }

                const event = IntegrationEvent.fromString(message.value.toString());
                await onEventReceived(event);
            },
        });
    }
}
