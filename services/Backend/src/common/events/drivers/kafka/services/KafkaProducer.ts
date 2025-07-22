import { Injectable } from "@nestjs/common";
import { type Producer, CompressionTypes, TopicMessages } from "kafkajs";

import { IntegrationEvent } from "@/common/events";
import { type IEventProducer } from "@/common/events/drivers/interfaces/IEventProducer";
import { PublishAck } from "@/common/events/types";

@Injectable()
export class KafkaProducer implements IEventProducer {
    private readonly compression: CompressionTypes;

    public constructor(private readonly producer: Producer) {
        this.compression = CompressionTypes.GZIP;
    }

    public publish(event: IntegrationEvent): Promise<PublishAck> {
        const message = {
            key: event.getPartitionKey(),
            value: event.toBuffer(),
        };

        const publishPromise = this.producer.send({
            compression: this.compression,
            topic: event.getTopic(),
            messages: [message],
        });

        return new Promise((resolve, reject) => {
            publishPromise.then(() => resolve({ ack: true })).catch(reject);
        });
    }

    public async publishBatch(events: IntegrationEvent[]): Promise<PublishAck> {
        const messagesByTopic = new Map<string, TopicMessages>();

        for (const event of events) {
            const topic = event.getTopic();
            const topicMessages = messagesByTopic.get(topic);

            if (!topicMessages) {
                messagesByTopic.set(topic, { topic, messages: [] });
            } else {
                topicMessages.messages.push({
                    key: event.getPartitionKey(),
                    value: event.toBuffer(),
                });
            }
        }

        const publishPromise = this.producer.sendBatch({
            topicMessages: Array.from(messagesByTopic.values()),
            compression: this.compression,
        });

        return new Promise((resolve, reject) => {
            publishPromise.then(() => resolve({ ack: true })).catch(reject);
        });
    }
}
