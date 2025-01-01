import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";
import { And, IsNull, LessThan, Not, Repository } from "typeorm";

import { IInboxEventHandler } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { IEventInbox } from "@/common/events/services/interfaces/IEventInbox";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

const MAX_PAGE_SIZE = 10;
const MAX_ATTEMPTS = 10;

/*
    > TODO: Implement better retry mechanism
    - Each event could have a timestamp - a point in time describing the readiness to be processed. After each retry,
    the delay between the next attempt would increase. But what if messages need to be processed in particular order?
    Delaying one message would then delay all other messages.

    > TODO: Is correct order of messages important for us?
    As always - it depends. Some messages can easily be idempotent. Some messages can fail if processed too early and on
    next retry we will achieve eventual consistency. I'd opt for creating messages that are as idempotent as possible and
    come back to this issue if there are any problems with data consistency.

    > TODO: How to handle 'poison' messages?
    - Each subscriber should be able to decide which topics are important and need to be processed in particular order,
    and if in case of error, the processing should be stopped.
 */
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

    public async clearProcessedEvents(processedBefore: Date): Promise<void> {
        try {
            const result = await this.getRepository().delete({
                processedAt: And(LessThan(processedBefore), Not(IsNull())),
            });
            const count = result.affected ?? 0;
            this.logger.log({ processedBefore, count }, "Removed old events.");
        } catch (err) {
            this.logger.error({ processedBefore, err }, "Failed to remove old events.");
        }
    }

    // TODO: Should each batch contain topics from only one topics family?
    public async process(handlers: IInboxEventHandler[]): Promise<void> {
        let totalProcessed = 0;
        let processedInRecentBatch = Infinity;

        while (processedInRecentBatch !== 0) {
            processedInRecentBatch = await this.processBatch(handlers, MAX_PAGE_SIZE, totalProcessed);
            totalProcessed += processedInRecentBatch;
        }

        if (totalProcessed === 0) {
            this.logger.log("No events to process.");
        } else {
            this.logger.log({ count: totalProcessed }, "Processed events");
        }
    }

    private async processBatch(handlers: IInboxEventHandler[], pageSize: number, offset: number): Promise<number> {
        return await this.txHost.withTransaction(async () => {
            const repository = this.getRepository();

            const entities = await repository
                .createQueryBuilder("event")
                .setLock("pessimistic_write")
                .setOnLocked("skip_locked")
                .where(`event.processedAt IS NULL AND event.attempts < ${MAX_ATTEMPTS}`)
                .orderBy("event.createdAt", "ASC")
                .take(pageSize)
                .skip(offset)
                .getMany();

            if (entities.length === 0) {
                return 0;
            }

            const processedEvents: InboxEventEntity[] = [];

            for (const entity of entities) {
                const event = IntegrationEvent.fromEntity(entity);
                const handler = handlers.find((h) => h.canHandle(event.getTopic()));

                try {
                    if (handler) {
                        await handler.handle(event);
                        entity.processedAt = new Date();
                    } else {
                        this.logger.warn(event, "Event cannot be processed - no handler found.");
                    }
                } catch (error) {
                    this.logger.error({ event, error }, "Failed to process event.");
                } finally {
                    entity.attempts++;
                    processedEvents.push(entity);
                }
            }

            await repository.save(processedEvents);
            return entities.length;
        });
    }

    private getRepository(): Repository<InboxEventEntity> {
        return this.txHost.tx.getRepository(InboxEventEntity);
    }
}
