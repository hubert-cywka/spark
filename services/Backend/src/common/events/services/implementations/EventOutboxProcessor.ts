import { Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { runInTransaction } from "typeorm-transactional";

import { IntegrationEvent } from "@/common/events";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { type IOutboxEventRepository } from "@/common/events/repositories/interfaces/IOutboxEvent.repository";
import { type IOutboxPartitionRepository } from "@/common/events/repositories/interfaces/IOutboxPartition.repository";
import { type IEventOutboxProcessor } from "@/common/events/services/interfaces/IEventOutboxProcessor";
import { type IPartitionAssigner } from "@/common/events/services/interfaces/IPartitionAssigner";
import { type IPubSubProducer } from "@/common/events/services/interfaces/IPubSubProducer";

const DEFAULT_MAX_BATCH_SIZE = 1000;
const DEFAULT_MAX_ATTEMPTS = 10_000;
const DEFAULT_STALE_PARTITION_THRESHOLD_MILLISECONDS = 30_000;

export interface EventOutboxProcessorOptions {
    connectionName: string;
    context: string;
    stalePartitionThreshold?: number;
    maxAttempts?: number;
    maxBatchSize?: number;
}

export class EventOutboxProcessor implements IEventOutboxProcessor {
    private readonly logger: Logger;
    private readonly connectionName: string;

    private readonly stalePartitionThreshold: number;
    private readonly maxAttempts: number;
    private readonly maxBatchSize: number;

    public constructor(
        private readonly client: IPubSubProducer,
        private readonly eventsRepository: IOutboxEventRepository,
        private readonly partitionsRepository: IOutboxPartitionRepository,
        private readonly partitionAssigner: IPartitionAssigner,
        options: EventOutboxProcessorOptions
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;

        this.stalePartitionThreshold = options.stalePartitionThreshold ?? DEFAULT_STALE_PARTITION_THRESHOLD_MILLISECONDS;
        this.maxBatchSize = options.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE;
        this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
    }

    public notifyOnEnqueued(event: IntegrationEvent): void {
        const partition = this.partitionAssigner.assign(event.getPartitionKey());
        void this.lockAndProcessPartition(partition);
    }

    public async processPendingEvents(): Promise<void> {
        const staleThreshold = dayjs().subtract(this.stalePartitionThreshold, "milliseconds").toDate();
        this.logger.debug("Polling for stale outbox partitions...");

        try {
            const { processed } = await runInTransaction(
                async () => {
                    const partitionToProcess = await this.partitionsRepository.getAndLockOldestStalePartition(staleThreshold);

                    if (!partitionToProcess) {
                        this.logger.debug({ staleThreshold }, "No more stale partitions to process.");
                        return { processed: false };
                    }

                    this.logger.debug({ partitionId: partitionToProcess.id }, "Found stale partition. Processing...");
                    const { ok } = await this.processPartition(partitionToProcess.id);
                    return { processed: ok };
                },
                { connectionName: this.connectionName }
            );

            if (processed) {
                await this.processPendingEvents();
            }
        } catch (error) {
            this.logger.error(error, "Failed to poll and process stale outbox partitions.");
        }
    }

    private async processPartition(partitionId: number) {
        return await runInTransaction(
            async () => {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const events = await this.eventsRepository.getBatchOfUnprocessedEvents({
                        partitionId: partitionId,
                        maxAttempts: this.maxAttempts,
                        take: this.maxBatchSize,
                    });

                    const { successfulEvents, failedEvent } = await this.publishEvents(events);
                    await this.updateEventsAndPartition(partitionId, successfulEvents, events);

                    if (failedEvent) {
                        this.logger.warn(
                            { partitionId, failedEventId: failedEvent.id },
                            "Stopped processing partition due to publish failure."
                        );
                        return { ok: false };
                    }

                    if (events.length < this.maxBatchSize) {
                        return { ok: true };
                    }
                }
            },
            { connectionName: this.connectionName }
        );
    }

    private async lockAndProcessPartition(partitionId: number) {
        return await runInTransaction(
            async () => {
                const partitionToProcess = await this.partitionsRepository.getAndLockPartition(partitionId);

                if (!partitionToProcess) {
                    this.logger.log({ partitionId }, "Partition already locked.");
                    return;
                }

                await this.processPartition(partitionToProcess.id);
            },
            { connectionName: this.connectionName }
        );
    }

    private async publishEvents(events: OutboxEventEntity[]) {
        const successfulEvents: OutboxEventEntity[] = [];
        let failedEvent: OutboxEventEntity | null = null;

        for (const eventEntity of events) {
            const event = IntegrationEvent.fromEntity(eventEntity);

            try {
                await this.client.publish(event);
                successfulEvents.push(eventEntity);
                this.logger.log({ eventId: event.getId() }, "Published event");
            } catch (error) {
                this.logger.error(error, "Failed to publish event. ACK not received.");
                failedEvent = eventEntity;
                break;
            }
        }

        return { successfulEvents, failedEvent };
    }

    private async updateEventsAndPartition(
        partitionId: number,
        successfulEvents: OutboxEventEntity[],
        allAttemptedEvents: OutboxEventEntity[]
    ) {
        const allAttemptedEventIds = allAttemptedEvents.map((e) => e.id);
        const successfulEventIds = successfulEvents.map((e) => e.id);

        if (allAttemptedEventIds.length > 0) {
            await this.eventsRepository.increaseAttempt(allAttemptedEventIds);
        }

        if (successfulEventIds.length > 0) {
            await this.eventsRepository.markAsProcessed(successfulEventIds);
        }

        if (allAttemptedEventIds.length === successfulEventIds.length) {
            await this.partitionsRepository.markAsProcessed(partitionId);
        }
    }
}
