import { Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { In, IsNull, LessThan, Repository } from "typeorm";
import { runInTransaction } from "typeorm-transactional";

import { IntegrationEvent } from "@/common/events";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { type IEventOutboxProcessor } from "@/common/events/services/interfaces/IEventOutboxProcessor";
import { type IPartitionAssigner } from "@/common/events/services/interfaces/IPartitionAssigner";
import { type IPubSubProducer } from "@/common/events/services/interfaces/IPubSubProducer";

const DEFAULT_MAX_BATCH_SIZE = 50;
const DEFAULT_MAX_ATTEMPTS = 10_000;
const DEFAULT_STALE_PARTITION_THRESHOLD_MILLISECONDS = 30_000;

export interface EventOutboxProcessorOptions {
    connectionName: string;
    context: string;
    stalePartitionThreshold?: number;
    maxAttempts?: number;
    maxBatchSize?: number;
}

/*
  Key decisions:
  1. Guaranteed order of processing within given partition.
  2. Poison messages are not handled. It is assumed, that publishing messages can fail only due to DB, broker or network issues.
  Trying to publish more messages would only worsen the issue. If processing 1 message withing partition fails, processing whole
  partition is cancelled. It also cancels processing of all other partitions.
  3. Two processing mechanisms:
     - push-based, after message is enqueued.
     - polling-based, to deliver all failed events.
*/
export class EventOutboxProcessor implements IEventOutboxProcessor {
    private readonly logger: Logger;
    private readonly connectionName: string;

    private readonly stalePartitionThreshold: number;
    private readonly maxAttempts: number;
    private readonly maxBatchSize: number;

    public constructor(
        private readonly client: IPubSubProducer,
        private readonly eventsRepository: Repository<OutboxEventEntity>,
        private readonly partitionsRepository: Repository<OutboxEventPartitionEntity>,
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
        void this.processPartition(partition, new Date());
    }

    public async processPendingEvents(): Promise<void> {
        const staleThreshold = dayjs().subtract(this.stalePartitionThreshold, "milliseconds").toDate();
        let stalePartitions: OutboxEventPartitionEntity[] = [];
        const processedPartitions: OutboxEventPartitionEntity[] = [];

        try {
            stalePartitions = await this.partitionsRepository
                .createQueryBuilder("partition")
                .select("partition.id")
                .where("partition.lastProcessedAt < :staleThreshold", {
                    staleThreshold,
                })
                .orWhere("partition.lastProcessedAt IS NULL")
                .getMany();

            if (stalePartitions.length === 0) {
                this.logger.debug("No stale outbox partitions found.");
                return;
            }

            this.logger.debug({ count: stalePartitions.length }, "Found stale outbox partitions. Processing...");

            for (const partition of stalePartitions) {
                const { ok } = await this.processPartition(partition.id, staleThreshold);

                if (ok) {
                    processedPartitions.push(partition);
                } else {
                    break;
                }
            }
        } catch (error) {
            this.logger.error(error, "Failed to poll and process stale outbox partitions.");
        }

        this.logger.debug(
            {
                total: stalePartitions.length,
                processed: processedPartitions.length,
            },
            "Finished processing stale outbox partitions."
        );
    }

    private async processPartition(partitionId: number, processedNoLaterThan: Date) {
        return await runInTransaction(
            async () => {
                const partition = await this.acquirePartitionLock(partitionId, processedNoLaterThan);

                if (!partition) {
                    return { ok: true };
                }

                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const events = await this.getNextBatchOfEvents(partitionId);
                    const { successfulEvents, failedEvent } = await this.publishEvents(events);
                    await this.updateEventsAndPartition(partition, successfulEvents, events);

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

    private async acquirePartitionLock(partitionId: number, processedNoLaterThan: Date): Promise<OutboxEventPartitionEntity | null> {
        try {
            return await this.partitionsRepository
                .createQueryBuilder("partition")
                .setLock("pessimistic_write")
                .setOnLocked("skip_locked")
                .where("partition.id = :partitionId", { partitionId })
                .andWhere("partition.lastProcessedAt < :processedNoLaterThan OR partition.lastProcessedAt IS NULL", {
                    processedNoLaterThan,
                })
                .getOne();
        } catch (error) {
            this.logger.error(`Failed to acquire lock for partition ${partitionId}`, error);
            return null;
        }
    }

    private async getNextBatchOfEvents(partitionId: number): Promise<OutboxEventEntity[]> {
        return this.eventsRepository.find({
            where: {
                partition: partitionId,
                processedAt: IsNull(),
                attempts: LessThan(this.maxAttempts),
            },
            order: {
                createdAt: "ASC",
            },
            take: this.maxBatchSize,
        });
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
        partition: OutboxEventPartitionEntity,
        successfulEvents: OutboxEventEntity[],
        allAttemptedEvents: OutboxEventEntity[]
    ) {
        const eventRepository = this.getEventRepository();
        const partitionRepository = this.getPartitionRepository();

        const allAttemptedEventIds = allAttemptedEvents.map((e) => e.id);
        const successfulEventIds = successfulEvents.map((e) => e.id);

        if (allAttemptedEventIds.length > 0) {
            await eventRepository.increment({ id: In(allAttemptedEventIds) }, "attempts", 1);
        }

        if (successfulEventIds.length > 0) {
            await eventRepository.update(successfulEventIds, {
                processedAt: new Date(),
            });
        }

        if (allAttemptedEventIds.length === successfulEventIds.length) {
            await partitionRepository.update(partition.id, {
                lastProcessedAt: new Date(),
            });
        }
    }

    private getEventRepository(): Repository<OutboxEventEntity> {
        return this.eventsRepository;
    }

    private getPartitionRepository(): Repository<OutboxEventPartitionEntity> {
        return this.partitionsRepository;
    }
}
