import { Injectable, Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { firstValueFrom, timeout } from "rxjs";
import { Repository } from "typeorm";
import { runInTransaction, runOnTransactionCommit } from "typeorm-transactional";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { type IEventOutboxOptions } from "@/common/events/services/interfaces/IEventOutboxOptions";
import { type IEventsRemover } from "@/common/events/services/interfaces/IEventsRemover";
import { type IIntegrationEventsEncryptionService } from "@/common/events/services/interfaces/IIntegrationEventsEncryption.service";
import { type IPubSubProducer } from "@/common/events/services/interfaces/IPubSubProducer";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

const MAX_PAGE_SIZE = 10;
const MAX_ATTEMPTS = 10;
const PUBLISH_TIMEOUT = 3000;

// TODO: Implement better retry mechanism
@Injectable()
export class EventOutbox implements IEventOutbox {
    private readonly connectionName: string;
    private readonly logger;

    public constructor(
        options: IEventOutboxOptions,
        private readonly repository: Repository<OutboxEventEntity>,
        private readonly client: IPubSubProducer,
        private readonly eventsRemover: IEventsRemover,
        private readonly encryptionService: IIntegrationEventsEncryptionService
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;
    }

    public async enqueue(event: IntegrationEvent, options?: { encrypt: boolean }): Promise<void> {
        const preparedEvent = await this.prepareEventToStore(event, options);
        const repository = this.getRepository();

        await runInTransaction(
            async () => {
                const entity = repository.create({
                    id: preparedEvent.getId(),
                    tenantId: preparedEvent.getTenantId(),
                    topic: preparedEvent.getTopic(),
                    payload: preparedEvent.getRawPayload(),
                    isEncrypted: preparedEvent.isEncrypted(),
                    createdAt: preparedEvent.getCreatedAt(),
                });

                await repository.save(entity);
                this.logger.log(preparedEvent, "Event added to outbox.");

                runOnTransactionCommit(async () => {
                    try {
                        await this.processSingle(preparedEvent.getId());
                    } catch (err) {
                        this.logger.log(err, "Failed to process event after enqueuing.");
                    }
                });
            },
            { connectionName: this.connectionName }
        );
    }

    public async clearProcessedEvents(processedBefore: Date): Promise<void> {
        await this.eventsRemover.removeProcessedBefore(processedBefore, this.getRepository());
    }

    public async clearTenantEvents(tenantId: string): Promise<void> {
        await this.eventsRemover.removeByTenant(tenantId, this.getRepository());
    }

    public async processPendingEvents() {
        try {
            let totalSuccessful = 0;
            let totalProcessed = 0;
            let breakpoint = true;

            while (breakpoint) {
                const { total, successful } = await this.processBatch(MAX_PAGE_SIZE, totalProcessed);
                totalProcessed += total;
                totalSuccessful += successful;

                if (total === 0) {
                    breakpoint = false;
                }
            }

            if (totalProcessed !== 0) {
                this.logger.log(
                    {
                        processed: {
                            total: totalProcessed,
                            successful: totalSuccessful,
                        },
                    },
                    "Processed events"
                );
            }
        } catch (error) {
            this.logger.error({ error }, "Failed to process pending events.");
        }
    }

    private async prepareEventToStore(event: IntegrationEvent, options?: { encrypt: boolean }): Promise<IntegrationEvent> {
        if (options?.encrypt) {
            return await this.encryptionService.encrypt(event);
        } else {
            return event.copy();
        }
    }

    private async processBatch(pageSize: number, offset: number) {
        return await runInTransaction(
            async () => {
                const repository = this.getRepository();

                const entities = await repository
                    .createQueryBuilder("event")
                    .setLock("pessimistic_write")
                    .setOnLocked("skip_locked")
                    .where("event.processedAt IS NULL")
                    .andWhere("event.attempts < :maxAttempts", {
                        maxAttempts: MAX_ATTEMPTS,
                    })
                    .orderBy("event.createdAt", "ASC")
                    .take(pageSize)
                    .skip(offset)
                    .getMany();

                if (!entities.length) {
                    return { successful: 0, total: 0 };
                }

                const publishPromises = entities.map((event) => this.publish(event));
                const processedEvents = await Promise.all(publishPromises);
                const processedSuccessfully = processedEvents.filter((event) => !!event.processedAt);
                await repository.save(processedEvents);

                return {
                    total: processedEvents.length,
                    successful: processedSuccessfully.length,
                };
            },
            { connectionName: this.connectionName }
        );
    }

    private async processSingle(id: string) {
        const repository = this.getRepository();

        await runInTransaction(
            async () => {
                const entity = await repository
                    .createQueryBuilder("event")
                    .setLock("pessimistic_write")
                    .setOnLocked("skip_locked")
                    .where("event.processedAt IS NULL")
                    .andWhere("event.attempts < :maxAttempts", {
                        maxAttempts: MAX_ATTEMPTS,
                    })
                    .andWhere("event.id = :id", { id })
                    .getOne();

                if (!entity) {
                    this.logger.error({ id }, "Couldn't find event to publish.");
                    return;
                }

                const processedEvent = await this.publish(entity);
                await repository.save(processedEvent);
            },
            { connectionName: this.connectionName }
        );
    }

    private async publish(entity: OutboxEventEntity): Promise<OutboxEventEntity> {
        const event = IntegrationEvent.fromEntity(entity);

        try {
            const ack = await firstValueFrom(this.client.publish(event).pipe(timeout(PUBLISH_TIMEOUT)));
            this.logger.log({ event, ack }, "Published event");
            entity.processedAt = dayjs().toDate();
        } catch (e) {
            this.logger.error({ event, e }, "Failed to publish event - ACK not received");
        }

        entity.attempts++;
        return entity;
    }

    private getRepository(): Repository<OutboxEventEntity> {
        return this.repository;
    }
}
