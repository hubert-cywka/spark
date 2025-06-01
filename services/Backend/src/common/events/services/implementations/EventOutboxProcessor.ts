import { Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { Repository } from "typeorm";
import { runInTransaction } from "typeorm-transactional";

import { IntegrationEvent } from "@/common/events";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { type IEventOutboxProcessor } from "@/common/events/services/interfaces/IEventOutboxProcessor";
import { type IPubSubProducer } from "@/common/events/services/interfaces/IPubSubProducer";
import { numberFromString } from "@/common/utils/hashUtils";

const DEFAULT_MAX_BATCH_SIZE = 50;
const DEFAULT_MAX_ATTEMPTS = 10_000;

const TOTAL_NUMBER_OF_PARTITIONS = 128; // TODO: Move to configuration.
const PARTITIONS_PER_BATCH = 32; // TODO: Move to configuration.

export interface EventOutboxProcessorOptions {
    connectionName: string;
    context: string;
    maxAttempts?: number;
    maxBatchSize?: number;
}

/*
  Key decisions:
  1. No handling of poison messages + unlimited retries - if message cannot be published, it's either a problem with
   network or with broker. No point in trying to publish another message.
  2. After first publish failure stop processing. Same reason as above.
  3. When new messages is enqueued, start processing. This reduces the delay between receiving and processing the
   message.
  4. Poll messages with reasonable interval. This will ensure that messages will get finally delivered.

  Known issues:
  1. Horizontal scaling may break order of processing. This could be solved by using a distributed lock,
   partitioning messages by tenantId, adding sequence number (and forcing consumers to handle ordering).
  2. Immediate publish after the message is enqueued may break order of processing. Current solution is to use mutex.
 */
export class EventOutboxProcessor implements IEventOutboxProcessor {
    private readonly logger: Logger;
    private readonly maxAttempts: number;
    private readonly maxBatchSize: number;
    private readonly connectionName: string;

    public constructor(
        private readonly client: IPubSubProducer,
        private readonly eventsRepository: Repository<OutboxEventEntity>,
        private readonly partitionsRepository: Repository<OutboxEventPartitionEntity>,
        options: EventOutboxProcessorOptions
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;

        this.maxBatchSize = options.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE;
        this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
    }

    public notifyOnEnqueued(event: IntegrationEvent) {
        const now = new Date();
        const partition = numberFromString(event.getPartitionKey(), TOTAL_NUMBER_OF_PARTITIONS); // TODO: Dependency injection instead?
        void this.processPendingEventsInternal({
            partitions: [partition],
            processedBefore: now,
        });
    }

    public async processPendingEvents() {
        const now = new Date();
        await this.processPendingEventsInternal({ processedBefore: now });
    }

    private async processPendingEventsInternal(options: { processedBefore: Date; partitions?: number[] }) {
        try {
            const { ok, hasMore } = await this.processNextBatchOfPartitions(options);

            if (!ok) {
                this.logger.error(options, "Some events in batch couldn't be processed, abandoning.");
                return;
            }

            if (hasMore) {
                await this.processPendingEventsInternal(options);
            }
        } catch (error) {
            this.logger.error(error, "Failed to process pending events.");
        }
    }

    public async processPendingEventsByPartitions(options: { partitions: number[] }): Promise<{ ok: boolean }> {
        try {
            const { total, successful } = await this.processNextBatchOfPendingEvents(options);

            if (total !== successful) {
                this.logger.error({ processed: { total, successful }, options }, "Some events in batch couldn't be processed, abandoning.");
                return { ok: false };
            }

            if (total !== 0) {
                this.logger.log({ processed: { total, successful } }, "Processed events.");
            }

            if (total === this.maxBatchSize) {
                return await this.processPendingEventsByPartitions(options);
            }

            return { ok: true };
        } catch (error) {
            this.logger.error(error, "Failed to process pending events.");
            return { ok: false };
        }
    }

    private async processNextBatchOfPendingEvents({ partitions }: { partitions: number[] }) {
        const events = await this.getEventRepository()
            .createQueryBuilder("event")
            .where("event.processedAt IS NULL")
            .andWhere("event.partition IN (:...partitions)", { partitions })
            .andWhere("event.attempts < :maxAttempts", {
                maxAttempts: this.maxAttempts,
            })
            .orderBy("event.createdAt", "ASC")
            .take(this.maxBatchSize)
            .getMany();

        return await this.bulkPublishAndUpdate(events);
    }

    private async bulkPublishAndUpdate(events: OutboxEventEntity[]) {
        const processed: OutboxEventEntity[] = [];
        const repository = this.getEventRepository();

        if (!events.length) {
            return { successful: 0, total: 0 };
        }

        for (const event of events) {
            const processedEvent = await this.publish(event);
            processed.push(processedEvent);

            if (!processedEvent.processedAt) {
                break;
            }
        }

        await repository.save(processed);

        return {
            total: processed.length,
            successful: processed.filter((event) => !!event.processedAt).length,
        };
    }

    private async publish(entity: OutboxEventEntity): Promise<OutboxEventEntity> {
        const event = IntegrationEvent.fromEntity(entity);

        try {
            await this.client.publish(event);
            this.logger.log({ event }, "Published event");
            entity.processedAt = dayjs().toDate();
        } catch (e) {
            this.logger.error({ event, e }, "Failed to publish event in time - ACK not received.");
        }

        entity.attempts++;
        return entity;
    }

    private getEventRepository(): Repository<OutboxEventEntity> {
        return this.eventsRepository;
    }

    private getPartitionRepository(): Repository<OutboxEventPartitionEntity> {
        return this.partitionsRepository;
    }

    private async processNextBatchOfPartitions(options: { processedBefore: Date; partitions?: number[] }) {
        return await runInTransaction(
            async () => {
                const batch = await this.getNextBatchOfPartitions(options);
                const partitionsIds = batch.map((partition) => partition.id);
                const { ok } = await this.processPendingEventsByPartitions({
                    partitions: partitionsIds,
                });

                if (ok) {
                    await this.updatePartitions(batch);
                } else {
                    // TODO
                }

                return { ok, hasMore: batch.length === PARTITIONS_PER_BATCH };
            },
            { connectionName: this.connectionName }
        );
    }

    private async updatePartitions(partitions: OutboxEventPartitionEntity[]) {
        const now = new Date();
        const updatedPartitions = partitions.map((partition) => ({
            ...partition,
            lastProcessedAt: now,
        }));
        await this.getPartitionRepository().save(updatedPartitions);
    }

    private async getNextBatchOfPartitions({ partitions, processedBefore }: { processedBefore: Date; partitions?: number[] }) {
        const query = this.getPartitionRepository()
            .createQueryBuilder("partition")
            .setLock("pessimistic_write")
            .setOnLocked("skip_locked")
            .where("partition.lastProcessedAt < :processedBefore", {
                processedBefore,
            });

        if (partitions) {
            query.andWhere("partition.id IN (:...partitions)", { partitions });
        }

        return await query.orderBy("partition.lastProcessedAt", "ASC", "NULLS FIRST").take(this.maxBatchSize).getMany();
    }
}
