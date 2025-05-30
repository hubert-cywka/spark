import { Logger } from "@nestjs/common";
import { Mutex } from "async-mutex";
import { Repository } from "typeorm";
import { runInTransaction } from "typeorm-transactional";

import { type IInboxEventHandler, IntegrationEvent } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { EventHandlersNotFoundError } from "@/common/events/errors/EventHandlersNotFound.error";
import { type IEventInboxProcessor } from "@/common/events/services/interfaces/IEventInboxProcessor";
import { type IIntegrationEventsEncryptionService } from "@/common/events/services/interfaces/IIntegrationEventsEncryption.service";
import { RetryBackoffPolicy } from "@/common/retry/RetryBackoffPolicy";

export interface EventInboxProcessorOptions {
    retryPolicy: RetryBackoffPolicy;
    connectionName: string;
    context: string;

    maxAttempts?: number;
    maxBatchSize?: number;
}

const DEFAULT_MAX_BATCH_SIZE = 5;
const DEFAULT_MAX_ATTEMPTS = 7;

// TODO: Enable scaling (use lease mechanism?)
// TODO: Ensure correct order (partition by tenantId)
// TODO: Handle poison messages.
export class EventInboxProcessor implements IEventInboxProcessor {
    private readonly logger: Logger;
    private readonly connectionName: string;

    private handlers: IInboxEventHandler[];
    private readonly processingMutex: Mutex;
    private readonly retryPolicy: RetryBackoffPolicy;

    private readonly maxAttempts: number;
    private readonly maxBatchSize: number;

    public constructor(
        private readonly repository: Repository<InboxEventEntity>,
        private readonly encryptionService: IIntegrationEventsEncryptionService,
        options: EventInboxProcessorOptions
    ) {
        this.processingMutex = new Mutex();
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;

        this.retryPolicy = options.retryPolicy;
        this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
        this.maxBatchSize = options.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE;
        this.handlers = [];
    }

    public notifyOnEnqueued(event: IntegrationEvent) {
        void this.processPendingEvents({ tenantId: event.getTenantId() });
    }

    public async processPendingEvents(options: { tenantId?: string } = {}): Promise<void> {
        await this.processingMutex.runExclusive(async () => {
            if (!this.isInitialized()) {
                this.logger.warn("Processor is not initialized.");
                return;
            }

            try {
                const { total, successful } = await this.processNextEventsBatch(options);

                if (total === 0) {
                    return;
                }

                if (total !== 0) {
                    this.logger.log({ processed: { total, successful } }, "Processed events.");
                }

                if (total === this.maxBatchSize) {
                    await this.processPendingEvents(options);
                }
            } catch (error) {
                this.logger.error(error, "Failed to process pending events.");
            }
        });
    }

    public setEventHandlers(handlers: IInboxEventHandler[]) {
        this.handlers = [...handlers];
    }

    private isInitialized() {
        return !!this.handlers.length;
    }

    private async processNextEventsBatch({ tenantId }: { tenantId?: string }) {
        const repository = this.getRepository();

        return await runInTransaction(
            async () => {
                const query = repository
                    .createQueryBuilder("event")
                    .setLock("pessimistic_write")
                    .setOnLocked("skip_locked")
                    .where("event.processedAt IS NULL")
                    .andWhere("event.attempts < :maxAttempts", {
                        maxAttempts: this.maxAttempts,
                    })
                    .andWhere("event.processAfter <= :now", {
                        now: new Date(),
                    });

                if (tenantId) {
                    query.andWhere("event.tenantId = :tenantId", { tenantId });
                }

                const entities = await query.orderBy("event.createdAt", "ASC").take(this.maxBatchSize).getMany();
                return await this.bulkHandleAndUpdate(entities);
            },
            { connectionName: this.connectionName }
        );
    }

    private async bulkHandleAndUpdate(entities: InboxEventEntity[]) {
        const repository = this.getRepository();
        const processedEvents: InboxEventEntity[] = [];

        for (const { event, entity, handler } of this.mapToEventsWithHandler(entities)) {
            try {
                await this.handleEvent(event, handler);
                entity.processedAt = new Date();
            } catch (error) {
                this.logger.error({ event, error }, "Failed to process event.");
            } finally {
                entity.attempts++;
                entity.processAfter = this.retryPolicy.getNextAttemptDate(entity.attempts);
                processedEvents.push(entity);
            }
        }

        if (processedEvents.length) {
            await repository.save(processedEvents);
        }

        return {
            total: processedEvents.length,
            successful: processedEvents.filter((event) => !!event.processedAt).length,
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

    private getRepository(): Repository<InboxEventEntity> {
        return this.repository;
    }
}
