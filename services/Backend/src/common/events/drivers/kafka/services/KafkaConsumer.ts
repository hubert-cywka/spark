import { Injectable, Logger } from "@nestjs/common";
import { type Consumer, Batch } from "kafkajs";

import { IntegrationEvent } from "@/common/events";
import { type IEventConsumer, OnEventsReceivedHandler } from "@/common/events/drivers/interfaces/IEventConsumer";

@Injectable()
export class KafkaConsumer implements IEventConsumer {
    private readonly logger = new Logger(KafkaConsumer.name);

    public constructor(
        private readonly consumer: Consumer,
        private readonly partitionsConsumedConcurrently: number
    ) {}

    public async listen(topics: string[], onEventsReceived: OnEventsReceivedHandler): Promise<void> {
        await this.consumer.subscribe({ topics, fromBeginning: true });
        this.logger.log({ topics }, "Subscribed to topics.");

        await this.consumer.run({
            partitionsConsumedConcurrently: this.partitionsConsumedConcurrently,
            eachBatch: async ({ resolveOffset, heartbeat, batch }) => {
                const events = this.getEventsFromBatch(batch);
                const emptyEventsCount = events.length - batch.messages.length;

                if (emptyEventsCount) {
                    this.logger.warn({ topic: batch.topic, count: emptyEventsCount }, "Received empty messages.");
                }

                await heartbeat();
                await onEventsReceived(events);

                for (const message of batch.messages) {
                    resolveOffset(message.offset);
                }
            },
        });
    }

    private getEventsFromBatch(batch: Batch) {
        return batch.messages.filter((message) => !!message.value).map((message) => IntegrationEvent.fromBuffer(message.value!));
    }
}
