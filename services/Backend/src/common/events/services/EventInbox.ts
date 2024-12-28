import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { IEventInbox } from "@/common/events/services/IEventInbox";
import type { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

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

        const entity = repository.create({
            id: event.getId(),
            topic: event.getTopic(),
            payload: event.getPayload() as object,
            createdAt: event.getCreatedAt(),
        });

        await repository.save(entity);
        this.logger.log(event, "Event enqueued.");
    }

    private getRepository(): Repository<OutboxEventEntity> {
        return this.txHost.tx.getRepository(OutboxEventEntity);
    }
}
