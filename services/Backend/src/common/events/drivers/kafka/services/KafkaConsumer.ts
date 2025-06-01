import { Injectable, Logger } from "@nestjs/common";
import { type Consumer } from "kafkajs";

import { IntegrationEvent } from "@/common/events";
import { type IPubSubConsumer, OnEventReceivedHandler } from "@/common/events/services/interfaces/IPubSubConsumer";

@Injectable()
export class KafkaConsumer implements IPubSubConsumer {
    private readonly logger = new Logger(KafkaConsumer.name);

    public constructor(private readonly consumer: Consumer) {}

    public async listen(topics: string[], onEventReceived: OnEventReceivedHandler): Promise<void> {
        await this.consumer.subscribe({ topics, fromBeginning: true });
        this.logger.log({ topics }, "Subscribed to topics.");

        await this.consumer.run({
            eachMessage: async ({ message, topic }) => {
                if (!message.value) {
                    this.logger.warn({ message, topic }, "Received empty message.");
                    return;
                }

                try {
                    await onEventReceived(IntegrationEvent.fromBuffer(message.value));
                } catch (error) {
                    this.logger.error(error, "Couldn't consume message.");
                    throw error;
                }
            },
        });
    }
}
