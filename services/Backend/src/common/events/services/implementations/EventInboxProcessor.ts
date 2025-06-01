import { Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { In, IsNull, LessThan, LessThanOrEqual, Not, Repository } from "typeorm";
import { runInTransaction } from "typeorm-transactional";

import { type IInboxEventHandler, IntegrationEvent } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { EventHandlersNotFoundError } from "@/common/events/errors/EventHandlersNotFound.error";
import { type IEventInboxProcessor } from "@/common/events/services/interfaces/IEventInboxProcessor";
import { type IIntegrationEventsEncryptionService } from "@/common/events/services/interfaces/IIntegrationEventsEncryption.service";
import { IPartitionAssigner } from "@/common/events/services/interfaces/IPartitionAssigner";
import { RetryBackoffPolicy } from "@/common/retry/RetryBackoffPolicy";

export interface EventInboxProcessorOptions {
    retryPolicy: RetryBackoffPolicy;
    connectionName: string;
    context: string;

    stalePartitionThreshold?: number;
    maxAttempts?: number;
    maxBatchSize?: number;
}

const DEFAULT_MAX_BATCH_SIZE = 5;
const DEFAULT_MAX_ATTEMPTS = 7;
const DEFAULT_STALE_PARTITION_THRESHOLD_MILLISECONDS = 30_000;

export class EventInboxProcessor implements IEventInboxProcessor {
    private readonly logger: Logger;
    private readonly connectionName: string;

    private handlers: IInboxEventHandler[];
    private readonly retryPolicy: RetryBackoffPolicy;

    private readonly stalePartitionThreshold: number;
    private readonly maxAttempts: number;
    private readonly maxBatchSize: number;

    public constructor(
        private readonly eventRepository: Repository<InboxEventEntity>,
        private readonly partitionRepository: Repository<InboxEventPartitionEntity>,
        private readonly partitionAssigner: IPartitionAssigner,
        private readonly encryptionService: IIntegrationEventsEncryptionService,
        options: EventInboxProcessorOptions
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;

        this.stalePartitionThreshold = options.stalePartitionThreshold ?? DEFAULT_STALE_PARTITION_THRESHOLD_MILLISECONDS;
        this.retryPolicy = options.retryPolicy;
        this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
        this.maxBatchSize = options.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE;
        this.handlers = [];
    }

    public notifyOnEnqueued(event: IntegrationEvent): void {
        const partition = this.partitionAssigner.assign(event.getPartitionKey());
        void this.processPartition(partition, new Date());
    }

    public setEventHandlers(handlers: IInboxEventHandler[]) {
        this.handlers = [...handlers];
    }

    private isInitialized() {
        return !!this.handlers.length;
    }

    public async processPendingEvents(): Promise<void> {
        if (!this.isInitialized()) {
            this.logger.error("Not initialized."); // TODO
            return;
        }

        const staleThreshold = dayjs().subtract(this.stalePartitionThreshold, "milliseconds").toDate();
        let stalePartitions: InboxEventPartitionEntity[] = [];

        try {
            stalePartitions = await this.getPartitionRepository()
                .createQueryBuilder("partition")
                .select("partition.id")
                .where("partition.lastProcessedAt < :staleThreshold", {
                    staleThreshold,
                })
                .orWhere("partition.lastProcessedAt IS NULL")
                .getMany();

            if (stalePartitions.length === 0) {
                this.logger.log("No stale inbox partitions found.");
                return;
            }

            this.logger.log({ count: stalePartitions.length }, "Found stale inbox partitions. Processing...");

            for (const partition of stalePartitions) {
                console.log("\n\n PARTITION: ", partition.id, "\n\n");
                await this.processPartition(partition.id, staleThreshold);
            }
        } catch (error) {
            this.logger.error(error, "Failed to poll and process stale inbox partitions.");
        }

        this.logger.log({ total: stalePartitions.length }, "Finished processing stale inbox partitions.");
    }

    private async bulkHandle(events: InboxEventEntity[]) {
        const successfulEvents: InboxEventEntity[] = [];
        const failedEvents: InboxEventEntity[] = [];
        const skippedEvents: InboxEventEntity[] = [];
        const blockedPartitionKeys: string[] = [];

        for (const { event, entity, handler } of this.mapToEventsWithHandler(events)) {
            if (blockedPartitionKeys.includes(entity.partitionKey)) {
                skippedEvents.push(entity);
                continue;
            }

            try {
                await this.handleEvent(event, handler);
                successfulEvents.push(entity);
            } catch (error) {
                this.logger.error(error, "Failed to process event.");
                blockedPartitionKeys.push(entity.partitionKey);
                failedEvents.push(entity);
            }
        }

        return { successfulEvents, failedEvents, skippedEvents, blockedPartitionKeys };
    }

    private mapToEventsWithHandler(entities: InboxEventEntity[]) {
        return entities.map((entity) => {
            const event = IntegrationEvent.fromEntity(entity);
            const handler = this.handlers.find((h) => h.canHandle(event.getTopic()));

            if (!handler) {
                this.logger.error(event, "Event cannot be processed - no handler found.");
                throw new EventHandlersNotFoundError();
            }

            return {
                entity,
                event,
                handler,
            };
        });
    }

    private async handleEvent(event: IntegrationEvent, handler: IInboxEventHandler) {
        const decryptedEvent = await this.encryptionService.decrypt(event);
        await handler.handle(decryptedEvent);
    }

    private async processPartition(partitionId: number, processedNoLaterThan: Date) {
        const blocked: string[] = [];

        return await runInTransaction(
            async () => {
                const partition = await this.acquirePartitionLock(partitionId, processedNoLaterThan);

                if (!partition) {
                    console.log("\n\n NOT FOUND \n\n");
                    return;
                }

                const stillBlockedPartitionKeys = await this.getBlockedPartitionKeysByPartition(partition.id);
                blocked.push(...stillBlockedPartitionKeys);

                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const events = await this.getNextBatchOfEvents(partitionId, blocked);
                    console.log("\n\n DEBUG 2: ", events, "\n\n");
                    const { successfulEvents, failedEvents, skippedEvents, blockedPartitionKeys } = await this.bulkHandle(events);
                    blocked.push(...blockedPartitionKeys);

                    await this.updateEventsAndPartition(partition, successfulEvents, failedEvents);

                    if (events.length < this.maxBatchSize) {
                        return;
                    }
                }
            },
            { connectionName: this.connectionName }
        );
    }

    private async acquirePartitionLock(partitionId: number, processedNoLaterThan: Date): Promise<InboxEventPartitionEntity | null> {
        try {
            return await this.getPartitionRepository()
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

    private async getBlockedPartitionKeysByPartition(partitionId: number): Promise<string[]> {
        const result = await this.getEventRepository()
            .createQueryBuilder("event")
            .select("event.partitionKey")
            .where("event.partition = :partitionId", { partitionId })
            .andWhere("event.processAfter > :now", { now: new Date() })
            .andWhere("event.processedAt IS NULL")
            .andWhere("event.attempts <= :maxAttempts", { maxAttempts: this.maxAttempts })
            .getMany();

        console.log("\n\n DEBUG 1: ", result, "\n\n");

        return result.map(({ partitionKey }) => partitionKey);
    }

    private async getNextBatchOfEvents(partitionId: number, blockedPartitionKeys: string[]): Promise<InboxEventEntity[]> {
        return this.getEventRepository().find({
            where: {
                partition: partitionId,
                partitionKey: Not(In(blockedPartitionKeys)),
                processedAt: IsNull(),
                processAfter: LessThanOrEqual(new Date()),
                attempts: LessThan(this.maxAttempts),
            },
            order: {
                createdAt: "ASC",
            },
            take: this.maxBatchSize,
        });
    }

    private async updateEventsAndPartition(
        partition: InboxEventPartitionEntity,
        successfulEvents: InboxEventEntity[],
        failedEvents: InboxEventEntity[]
    ) {
        const eventRepository = this.getEventRepository();
        const partitionRepository = this.getPartitionRepository();

        if (successfulEvents.length > 0) {
            await eventRepository.save(
                successfulEvents.map((event) => {
                    const attempts = event.attempts + 1;

                    return {
                        ...event,
                        attempts,
                        processedAt: new Date(),
                    };
                })
            );
        }

        if (failedEvents.length > 0) {
            await eventRepository.save(
                failedEvents.map((event) => {
                    const attempts = event.attempts + 1;

                    return {
                        ...event,
                        attempts,
                        processAfter: this.retryPolicy.getNextAttemptDate(attempts),
                    };
                })
            );
        }

        if (!failedEvents.length) {
            await partitionRepository.update(partition.id, {
                lastProcessedAt: new Date(),
            });
        }
    }

    private getEventRepository(): Repository<InboxEventEntity> {
        return this.eventRepository;
    }

    private getPartitionRepository(): Repository<InboxEventPartitionEntity> {
        return this.partitionRepository;
    }
}
