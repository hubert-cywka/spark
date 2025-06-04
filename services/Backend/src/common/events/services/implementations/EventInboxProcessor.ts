import { Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { runInTransaction } from "typeorm-transactional";

import { type IInboxEventHandler, IntegrationEvent } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { EventHandlersNotFoundError } from "@/common/events/errors/EventHandlersNotFound.error";
import { type IInboxEventRepository } from "@/common/events/repositories/interfaces/IInboxEvent.repository";
import { type IInboxPartitionRepository } from "@/common/events/repositories/interfaces/IInboxPartition.repository";
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

/*
  Key characteristics:
  1. Guaranteed order of processing within given partition.
  2. Poison messages are handled. If message can't be processed, all messages with the same partitionKey will be
   postponed. Two different partitionKeys, even withing the same partition, don't affect each other.
  3. Two processing mechanisms:
     - push-based, after message is enqueued.
     - polling-based, to deliver all failed events.
*/
export class EventInboxProcessor implements IEventInboxProcessor {
    private readonly logger: Logger;
    private readonly connectionName: string;

    private handlers: IInboxEventHandler[];
    private readonly retryPolicy: RetryBackoffPolicy;

    private readonly stalePartitionThreshold: number;
    private readonly maxAttempts: number;
    private readonly maxBatchSize: number;

    public constructor(
        private readonly eventsRepository: IInboxEventRepository,
        private readonly partitionsRepository: IInboxPartitionRepository,
        private readonly partitionAssigner: IPartitionAssigner,
        private readonly encryptionService: IIntegrationEventsEncryptionService,
        options: EventInboxProcessorOptions
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;
        this.retryPolicy = options.retryPolicy;
        this.handlers = [];

        this.stalePartitionThreshold = options.stalePartitionThreshold ?? DEFAULT_STALE_PARTITION_THRESHOLD_MILLISECONDS;
        this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
        this.maxBatchSize = options.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE;
    }

    public notifyOnEnqueued(event: IntegrationEvent): void {
        const partition = this.partitionAssigner.assign(event.getPartitionKey());
        void this.lockAndProcessPartition(partition);
    }

    public setEventHandlers(handlers: IInboxEventHandler[]) {
        this.handlers = [...handlers];
    }

    private isInitialized() {
        return !!this.handlers.length;
    }

    public async processPendingEvents(): Promise<void> {
        if (!this.isInitialized()) {
            this.logger.warn("Processor is not initialized.");
            return;
        }

        const staleThreshold = dayjs().subtract(this.stalePartitionThreshold, "milliseconds").toDate();

        try {
            const { hasMore } = await runInTransaction(
                async () => {
                    const partitionToProcess = await this.partitionsRepository.getAndLockSingleStalePartition(staleThreshold);

                    if (!partitionToProcess) {
                        this.logger.debug({ staleThreshold }, "No more stale partitions to process.");
                        return { hasMore: false };
                    }

                    this.logger.debug({ partitionId: partitionToProcess.id }, "Found stale partition. Processing...");
                    await this.processPartition(partitionToProcess.id);

                    return { hasMore: true };
                },
                { connectionName: this.connectionName }
            );

            if (hasMore) {
                await this.processPendingEvents();
            }
        } catch (error) {
            this.logger.error(error, "Failed to poll and process stale inbox partitions.");
        }
    }

    private async processPartition(partitionId: number) {
        const blocked: string[] = [];

        return await runInTransaction(
            async () => {
                const stillBlockedPartitionKeys = await this.eventsRepository.getBlockedEventsPartitionKeysByPartition({
                    partitionId: partitionId,
                    maxAttempts: this.maxAttempts,
                });

                blocked.push(...stillBlockedPartitionKeys);

                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const events = await this.eventsRepository.getBatchOfUnprocessedEvents({
                        partitionId,
                        maxAttempts: this.maxAttempts,
                        take: this.maxBatchSize,
                        blockedPartitionKeys: blocked,
                    });

                    const { successfulEvents, failedEvents, blockedPartitionKeys } = await this.bulkHandle(events);
                    blocked.push(...blockedPartitionKeys);

                    if (successfulEvents.length > 0) {
                        await this.eventsRepository.markAsProcessed(successfulEvents);
                    }

                    if (failedEvents.length > 0) {
                        await this.eventsRepository.markAsPostponed(failedEvents, (attempt) =>
                            this.retryPolicy.getNextAttemptDate(attempt)
                        );
                    }

                    if (!failedEvents.length) {
                        await this.partitionsRepository.markAsProcessed(partitionId);
                    }

                    if (events.length < this.maxBatchSize) {
                        return;
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

        return {
            successfulEvents,
            failedEvents,
            skippedEvents,
            blockedPartitionKeys,
        };
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
}
