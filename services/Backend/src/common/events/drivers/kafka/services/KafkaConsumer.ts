import { Injectable, Logger } from "@nestjs/common";
import { type Consumer, Batch } from "kafkajs";

import { IntegrationEvent } from "@/common/events";
import { type IEventConsumer, OnEventsReceivedHandler } from "@/common/events/drivers/interfaces/IEventConsumer";
import {
    kafkaBatchSizeHistogram,
    kafkaConsumedMessagesCounter,
    kafkaProcessingDurationHistogram,
    kafkaReceivedMessagesCounter,
} from "@/common/events/drivers/kafka/observability/metrics";
import { IntegrationEventLabel } from "@/common/events/types";

@Injectable()
export class KafkaConsumer implements IEventConsumer {
    private readonly logger = new Logger(KafkaConsumer.name);

    public constructor(
        private readonly consumer: Consumer,
        private readonly partitionsConsumedConcurrently: number
    ) {}

    public async listen(labels: IntegrationEventLabel[], onEventsReceived: OnEventsReceivedHandler): Promise<void> {
        const topics = [...new Set(labels.map((event) => event.topic))];

        await this.consumer.subscribe({ topics, fromBeginning: true });
        this.logger.log({ topics }, "Subscribed to topics.");

        await this.consumer.run({
            partitionsConsumedConcurrently: this.partitionsConsumedConcurrently,
            eachBatch: async ({ resolveOffset, heartbeat, batch }) => {
                const startTime = process.hrtime.bigint();
                kafkaBatchSizeHistogram.record(batch.messages.length, { topic: batch.topic });

                const incomingEvents = this.getEventsFromBatch(batch);
                const emptyEventsCount = incomingEvents.length - batch.messages.length;

                if (emptyEventsCount) {
                    this.logger.warn({ topic: batch.topic, count: emptyEventsCount }, "Received empty messages.");
                }

                kafkaReceivedMessagesCounter.add(incomingEvents.length, { topic: batch.topic });

                await heartbeat();
                const eventsTheConsumerIsInterestedIn = incomingEvents.filter(
                    (event) => !!labels.find((label) => label.subject === event.getSubject() && label.topic === event.getTopic())
                );

                if (eventsTheConsumerIsInterestedIn.length > 0) {
                    await onEventsReceived(eventsTheConsumerIsInterestedIn);
                    kafkaConsumedMessagesCounter.add(eventsTheConsumerIsInterestedIn.length, { topic: batch.topic });
                }

                for (const message of batch.messages) {
                    resolveOffset(message.offset);
                }

                const endTime = process.hrtime.bigint();
                const durationMilliseconds = Number(endTime - startTime) / 1_000_000;
                kafkaProcessingDurationHistogram.record(durationMilliseconds, { topic: batch.topic });
            },
        });
    }

    private getEventsFromBatch(batch: Batch) {
        return batch.messages.filter((message) => !!message.value).map((message) => IntegrationEvent.fromBuffer(message.value!));
    }
}
