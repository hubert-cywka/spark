import { Injectable, Logger } from "@nestjs/common";
import { type Producer, CompressionTypes, TopicMessages } from "kafkajs";

import { IntegrationEvent } from "@/common/events";
import { type IEventProducer } from "@/common/events/drivers/interfaces/IEventProducer";
import { kafkaPublishedMessagesCounter } from "@/common/events/drivers/kafka/observability/metrics";
import { PublishAck } from "@/common/events/types";

@Injectable()
export class KafkaProducer implements IEventProducer {
    private readonly compression: CompressionTypes;
    private readonly logger = new Logger(KafkaProducer.name);

    public constructor(private readonly producer: Producer) {
        this.compression = CompressionTypes.GZIP;
    }

    public async publish(event: IntegrationEvent): Promise<PublishAck> {
        const message = {
            key: event.getPartitionKey(),
            value: event.toBuffer(),
        };

        await this.producer.send({
            compression: this.compression,
            topic: event.getTopic(),
            messages: [message],
        });

        kafkaPublishedMessagesCounter.add(1, { topic: event.getTopic() });

        this.logger.log({ eventId: event.getId() }, "Published event");
        return { ack: true };
    }

    public async publishBatch(events: IntegrationEvent[]): Promise<PublishAck> {
        const messagesByTopic = new Map<string, TopicMessages>();

        for (const event of events) {
            const topic = event.getTopic();
            const topicMessages = messagesByTopic.get(topic);
            const message = {
                key: event.getPartitionKey(),
                value: event.toBuffer(),
            };

            if (!topicMessages) {
                messagesByTopic.set(topic, { topic, messages: [message] });
            } else {
                topicMessages.messages.push(message);
            }
        }

        await this.producer.sendBatch({
            topicMessages: Array.from(messagesByTopic.values()),
            compression: this.compression,
        });

        for (const { messages, topic } of messagesByTopic.values()) {
            kafkaPublishedMessagesCounter.add(messages.length, { topic });
        }

        this.logger.log({ eventIds: events.map((e) => e.getId()) }, "Published events");
        return { ack: true };
    }
}
