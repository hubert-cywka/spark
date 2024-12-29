import { Injectable, Logger } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";
import { IsNull, Repository } from "typeorm";

import { type IEventOutbox } from "./IEventOutbox";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

const MAX_PAGE_SIZE = 25;

@Injectable()
export class EventOutbox implements IEventOutbox {
    private readonly logger;

    public constructor(
        private client: ClientProxy,
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
        this.logger.log(event, "Event enqueued.");
    }

    public async process() {
        let totalProcessed = 0;
        let processedInRecentBatch = Infinity;

        while (processedInRecentBatch >= MAX_PAGE_SIZE) {
            processedInRecentBatch = await this.processBatch(MAX_PAGE_SIZE, totalProcessed);
            totalProcessed += processedInRecentBatch;
        }

        this.logger.log({ count: totalProcessed }, "Processed events");
    }

    private async processBatch(pageSize: number, offset: number) {
        const repository = this.getRepository();

        const events = await repository.find({
            where: {
                processedAt: IsNull(),
            },
            order: {
                createdAt: "ASC",
            },
            take: pageSize,
            skip: offset,
        });

        events.forEach((event) => this.publish(event));
        const now = dayjs();

        const processedEvents = events.map((event) => ({
            ...event,
            processedAt: now,
            attempts: event.attempts++,
        }));
        const results = await repository.save(processedEvents);
        return results.length;
    }

    private publish(entity: OutboxEventEntity) {
        const event = IntegrationEvent.fromEntity(entity);
        this.client.emit(event.getTopic(), event);
        this.logger.log(event, "Published event");
    }

    private getRepository(): Repository<OutboxEventEntity> {
        return this.txHost.tx.getRepository(OutboxEventEntity);
    }
}
