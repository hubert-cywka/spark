import { Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { firstValueFrom, timeout } from "rxjs";
import { Repository } from "typeorm";
import { runInTransaction } from "typeorm-transactional";

import { IntegrationEvent } from "@/common/events";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { type IEventOutboxProcessor } from "@/common/events/services/interfaces/IEventOutboxProcessor";
import { type IPubSubProducer } from "@/common/events/services/interfaces/IPubSubProducer";

export interface EventOutboxProcessorOptions {
    connectionName: string;
    context: string;
    maxAttempts?: number;
    maxBatchSize?: number;
    publishTimeout?: number;
}

const DEFAULT_MAX_BATCH_SIZE = 50;
const DEFAULT_MAX_ATTEMPTS = 10_000;
const DEFAULT_PUBLISH_TIMEOUT = 3000;

// TODO: Enable scaling (use lease mechanism?), remember about maintaining correct order (partition by tenantId)

export class EventOutboxProcessor implements IEventOutboxProcessor {
    private readonly logger;
    private readonly maxAttempts: number;
    private readonly maxBatchSize: number;
    private readonly publishTimeout: number;
    private readonly connectionName: string;

    public constructor(
        private readonly client: IPubSubProducer,
        private readonly repository: Repository<OutboxEventEntity>,
        options: EventOutboxProcessorOptions
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;

        this.maxBatchSize = options.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE;
        this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
        this.publishTimeout = options.publishTimeout ?? DEFAULT_PUBLISH_TIMEOUT;
    }

    public notifyOnEnqueued(event: IntegrationEvent) {
        void this.processPendingEvents({ tenantId: event.getTenantId() });
    }

    public async processPendingEvents(options: { tenantId?: string } = {}) {
        try {
            const { total, successful } = await this.processNextBatchOfPendingEvents(options);

            if (total !== successful) {
                this.logger.error({ processed: { total, successful }, options }, "Some events in batch couldn't be processed, abandoning.");
                return;
            }

            if (total !== 0) {
                this.logger.log({ processed: { total, successful } }, "Processed events.");
            }

            if (total === this.maxBatchSize) {
                await this.processPendingEvents(options);
            }
        } catch (error) {
            this.logger.error({ error }, "Failed to process pending events.");
        }
    }

    private async processNextBatchOfPendingEvents({ tenantId }: { tenantId?: string } = {}) {
        return await runInTransaction(
            async () => {
                const query = this.getRepository()
                    .createQueryBuilder("event")
                    .setLock("pessimistic_write")
                    .setOnLocked("skip_locked")
                    .where("event.processedAt IS NULL")
                    .andWhere("event.attempts < :maxAttempts", {
                        maxAttempts: this.maxAttempts,
                    })
                    .orderBy("event.createdAt", "ASC");

                if (tenantId) {
                    query.andWhere("event.tenantId = :tenantId", { tenantId });
                }

                const events = await query.take(this.maxBatchSize).getMany();
                return await this.bulkPublishAndUpdate(events);
            },
            { connectionName: this.connectionName }
        );
    }

    private async bulkPublishAndUpdate(events: OutboxEventEntity[]) {
        const processed: OutboxEventEntity[] = [];
        const repository = this.getRepository();

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
            const ack = await firstValueFrom(this.client.publish(event).pipe(timeout(this.publishTimeout)));
            this.logger.log({ event, ack }, "Published event");
            entity.processedAt = dayjs().toDate();
        } catch (e) {
            this.logger.error({ event, e }, "Failed to publish event in time - ACK not received.");
        }

        entity.attempts++;
        return entity;
    }

    private getRepository(): Repository<OutboxEventEntity> {
        return this.repository;
    }
}
