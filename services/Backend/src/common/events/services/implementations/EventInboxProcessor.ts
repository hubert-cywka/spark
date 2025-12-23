import { Logger } from "@nestjs/common";
import Bottleneck from "bottleneck";
import dayjs from "dayjs";
import { runInTransaction } from "typeorm-transactional";

import { inboxMetrics } from "../../observability/metrics";

import { type IInboxEventHandler, IntegrationEvent } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { EventHandlersNotFoundError } from "@/common/events/errors/EventHandlersNotFound.error";
import { type IInboxEventRepository } from "@/common/events/repositories/interfaces/IInboxEvent.repository";
import { type IInboxPartitionRepository } from "@/common/events/repositories/interfaces/IInboxPartition.repository";
import { type IEventInboxProcessor } from "@/common/events/services/interfaces/IEventInboxProcessor";
import { type IIntegrationEventsEncryptionService } from "@/common/events/services/interfaces/IIntegrationEventsEncryptionService";
import { IPartitionAssigner } from "@/common/events/services/interfaces/IPartitionAssigner";
import { RetryBackoffPolicy } from "@/common/retry/RetryBackoffPolicy";
import { IThrottler } from "@/common/services/interfaces/IThrottler";

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

const INVALIDATION_THROTTLE_TIME = 300;

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
        private readonly throttler: IThrottler,
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
        this.throttler.throttle(
            `invalidate_inbox_partition_${partition}`,
            () => this.prioritizePartition(partition),
            INVALIDATION_THROTTLE_TIME
        );
    }

    private async prioritizePartition(partition: number) {
        try {
            await this.partitionsRepository.invalidatePartition(partition);
        } catch (error) {
            this.logger.error({ partition }, "Failed to invalidate partition.");
        }
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

        try {
            const { hasMore } = await runInTransaction(
                async () => {
                    const startTime = process.hrtime.bigint();
                    const partitionToProcess = await this.partitionsRepository.getAndLockOldestStalePartition();

                    if (!partitionToProcess) {
                        this.logger.debug("No more stale partitions to process.");
                        return { hasMore: false };
                    }

                    this.logger.debug({ partitionId: partitionToProcess.id }, "Found stale partition. Processing...");
                    await this.processPartition(partitionToProcess.id);

                    const endTime = process.hrtime.bigint();
                    inboxMetrics.processDuration.record(Number(endTime - startTime) / 1_000_000, { partitionId: partitionToProcess.id });

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

                    inboxMetrics.transactionBatchSize.record(events.length, { partitionId });

                    const { successfulEvents, failedEvents, blockedPartitionKeys } = await this.bulkHandle(events);
                    blocked.push(...blockedPartitionKeys);

                    if (successfulEvents.length > 0 || failedEvents.length > 0) {
                        await this.eventsRepository.update([...successfulEvents, ...failedEvents]);
                    }

                    inboxMetrics.processedEvents.add(successfulEvents.length, { partitionId });

                    if (failedEvents.length > 0) {
                        inboxMetrics.processingFailure.add(failedEvents.length, { partitionId });
                    }

                    if (events.length < this.maxBatchSize) {
                        const staleAt = !failedEvents.length
                            ? dayjs().add(this.stalePartitionThreshold, "milliseconds").toDate()
                            : new Date();

                        await this.partitionsRepository.markAsProcessed(partitionId, staleAt);

                        return;
                    }
                }
            },
            { connectionName: this.connectionName }
        );
    }

    private async bulkHandle(events: InboxEventEntity[]) {
        const successfulEvents: InboxEventEntity[] = [];
        const failedEvents: InboxEventEntity[] = [];
        const skippedEvents: InboxEventEntity[] = [];
        const blockedPartitionKeys = new Set<string>();

        const limiter = new Bottleneck.Group({
            maxConcurrent: 1,
        });

        const processingPromises = events.map((entity) =>
            limiter.key(entity.partitionKey).schedule(async () => {
                if (blockedPartitionKeys.has(entity.partitionKey)) {
                    skippedEvents.push(entity);
                    return;
                }

                const { event, handler } = this.mapEventToHandler(entity);

                try {
                    await this.handleEvent(event, handler);
                    const processingLag = dayjs().diff(entity.receivedAt, "milliseconds");
                    inboxMetrics.processingLag.record(processingLag, { topic: event.getTopic(), subject: event.getSubject() });

                    successfulEvents.push({
                        ...entity,
                        processedAt: new Date(),
                        attempts: entity.attempts + 1,
                    });
                } catch (error) {
                    this.logger.error(error, "Failed to process event.");
                    blockedPartitionKeys.add(entity.partitionKey);
                    failedEvents.push({
                        ...entity,
                        processAfter: this.retryPolicy.getNextAttemptDate(entity.attempts),
                        attempts: entity.attempts + 1,
                    });
                }
            })
        );

        await Promise.all(processingPromises);

        return {
            successfulEvents,
            failedEvents,
            skippedEvents,
            blockedPartitionKeys: Array.from(blockedPartitionKeys),
        };
    }

    private mapEventToHandler(entity: InboxEventEntity) {
        const event = IntegrationEvent.fromEntity(entity);
        const handler = this.handlers.find((h) => h.canHandle(event.getSubject()));

        if (!handler) {
            this.logger.error(event, "Event cannot be processed - no handler found.");
            throw new EventHandlersNotFoundError();
        }

        return {
            event,
            handler,
        };
    }

    private async handleEvent(event: IntegrationEvent, handler: IInboxEventHandler) {
        const decryptedEvent = await this.encryptionService.decrypt(event);
        await handler.handle(decryptedEvent);
    }
}
