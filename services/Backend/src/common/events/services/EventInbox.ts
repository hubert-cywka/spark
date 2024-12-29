import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";
import { Repository } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
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
            payload: event.getPayload(),
            createdAt: event.getCreatedAt(),
            receivedAt: dayjs(),
        });

        await repository.save(entity);
        this.logger.log(event, "Event enqueued.");
    }

    public async process(): Promise<void> {
        // TODO: Implement
        this.logger.log("Processing inbox");
    }

    private getRepository(): Repository<InboxEventEntity> {
        return this.txHost.tx.getRepository(InboxEventEntity);
    }
}
