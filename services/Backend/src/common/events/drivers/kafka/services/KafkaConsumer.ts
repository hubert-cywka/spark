import { Injectable, Logger } from "@nestjs/common";
import { type Consumer, Batch } from "kafkajs";

import { IntegrationEvent } from "@/common/events";
import { type IEventConsumer, OnEventsReceivedHandler } from "@/common/events/drivers/interfaces/IEventConsumer";
import { IntegrationEventLabel } from "@/common/events/types";

@Injectable()
export class KafkaConsumer implements IEventConsumer {
    private readonly logger = new Logger(KafkaConsumer.name);

    public constructor(
        private readonly consumer: Consumer,
        private readonly partitionsConsumedConcurrently: number
    ) {}

    public async listen(events: IntegrationEventLabel[], onEventsReceived: OnEventsReceivedHandler): Promise<void> {
        const topics = [...new Set(events.map((event) => event.topic))];
        const subjects = [...new Set(events.map((event) => event.subject))];

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
                const eventsTheConsumerIsInterestedIn = events.filter((event) => subjects.includes(event.getSubject()));
                await onEventsReceived(eventsTheConsumerIsInterestedIn);

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
