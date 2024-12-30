import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";
import { IsNull, Repository } from "typeorm";

import { IInboxEventHandler } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { IEventInbox } from "@/common/events/services/interfaces/IEventInbox";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

const MAX_PAGE_SIZE = 25;

@Injectable()
export class EventInbox implements IEventInbox {
    private readonly logger;

    public constructor(
        private txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        context?: string
    ) {
        this.logger = new Logger(context ?? EventInbox.name);
    }

    public async enqueue(event: IntegrationEvent): Promise<void> {
        const repository = this.getRepository();

        await this.txHost.withTransaction(async () => {
            const exists = await repository.existsBy({ id: event.getId() });

            if (exists) {
                this.logger.log(event, "Event already in inbox.");
                return;
            }

            await repository.save({
                id: event.getId(),
                topic: event.getTopic(),
                payload: event.getPayload(),
                createdAt: event.getCreatedAt(),
                receivedAt: dayjs(),
            });
            this.logger.log(event, "Event added to inbox.");
        });
    }

    public async process(handlers: IInboxEventHandler[]): Promise<void> {
        let totalProcessed = 0;
        let processedInRecentBatch = Infinity;

        while (processedInRecentBatch >= MAX_PAGE_SIZE) {
            processedInRecentBatch = await this.processBatch(handlers, MAX_PAGE_SIZE, totalProcessed);
            totalProcessed += processedInRecentBatch;
        }

        this.logger.log({ count: totalProcessed }, "Processed events");
    }

    private async processBatch(handlers: IInboxEventHandler[], pageSize: number, offset: number) {
        const repository = this.getRepository();

        const entities = await repository.find({
            where: {
                processedAt: IsNull(),
            },
            order: {
                createdAt: "ASC",
            },
            take: pageSize,
            skip: offset,
        });

        const processedEvents: InboxEventEntity[] = [];

        await this.txHost.withTransaction(async () => {
            for (const entity of entities) {
                const event = IntegrationEvent.fromEntity(entity);
                const handler = handlers.find((h) => h.canHandle(event.getTopic()));

                try {
                    if (handler) {
                        await handler.handle(event);
                        processedEvents.push({
                            ...entity,
                            processedAt: dayjs().toDate(),
                            attempts: ++entity.attempts,
                        });
                    } else {
                        this.logger.warn(event, "Event cannot be processed - no handler found.");
                    }
                } catch (error) {
                    this.logger.error({ event, error }, "Failed to process event.");
                    processedEvents.push({
                        ...entity,
                        attempts: ++entity.attempts,
                    });
                }
            }

            await repository.save(processedEvents);
        });

        return entities.length;
    }

    private getRepository(): Repository<InboxEventEntity> {
        return this.txHost.tx.getRepository(InboxEventEntity);
    }
}
