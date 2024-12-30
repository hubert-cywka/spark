import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { NatsJetStreamClientProxy, NatsJetStreamRecordBuilder } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import dayjs from "dayjs";
import { Repository } from "typeorm";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

const MAX_PAGE_SIZE = 10;

// TODO: Implement circuit breaker (based on number of delivery attempts) and remove already processed events after X days.
@Injectable()
export class EventOutbox implements IEventOutbox {
    private readonly logger;

    public constructor(
        private client: NatsJetStreamClientProxy,
        private txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        context?: string
    ) {
        this.logger = new Logger(context ?? EventOutbox.name);
    }

    public async enqueue(event: IntegrationEvent): Promise<void> {
        const repository = this.getRepository();

        const entity = repository.create({
            id: event.getId(),
            topic: event.getTopic(),
            payload: event.getPayload(),
            createdAt: event.getCreatedAt(),
        });

        await repository.save(entity);
        this.logger.log(event, "Event added to outbox.");
    }

    public async process() {
        let totalProcessed = 0;
        let processedInRecentBatch = Infinity;

        while (processedInRecentBatch !== 0) {
            processedInRecentBatch = await this.processBatch(MAX_PAGE_SIZE, totalProcessed);
            totalProcessed += processedInRecentBatch;
        }

        this.logger.log({ count: totalProcessed }, "Processed events");
    }

    private async processBatch(pageSize: number, offset: number) {
        return await this.txHost.withTransaction(async () => {
            const repository = this.getRepository();

            const entities = await repository
                .createQueryBuilder("event")
                .setLock("pessimistic_write")
                .setOnLocked("skip_locked")
                .where("event.processedAt IS NULL")
                .orderBy("event.createdAt", "ASC")
                .take(pageSize)
                .skip(offset)
                .getMany();

            if (!entities.length) {
                return 0;
            }

            entities.forEach((event) => this.publish(event));
            const now = dayjs();

            const processedEvents = entities.map((event) => ({
                ...event,
                processedAt: now,
                attempts: ++event.attempts,
            }));
            await repository.save(processedEvents);
            return entities.length;
        });
    }

    // TODO: Make it awaitable, return entity only after event was ACKed, and then save all successfully sent events
    private publish(entity: OutboxEventEntity) {
        const event = IntegrationEvent.fromEntity(entity);

        const builder = new NatsJetStreamRecordBuilder();
        builder.setMsgId(event.getId());
        builder.setPayload(event);
        const record = builder.build();

        this.client.emit(event.getTopic(), record);
        this.logger.log(event, "Published event");
    }

    private getRepository(): Repository<OutboxEventEntity> {
        return this.txHost.tx.getRepository(OutboxEventEntity);
    }
}
