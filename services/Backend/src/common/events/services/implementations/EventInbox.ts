import { Injectable, Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { Repository } from "typeorm";
import { runInTransaction, runOnTransactionCommit } from "typeorm-transactional";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { type IEventInbox } from "@/common/events/services/interfaces/IEventInbox";
import { type IEventInboxOptions } from "@/common/events/services/interfaces/IEventInboxOptions";
import { type IEventsQueueSubscriber } from "@/common/events/services/interfaces/IEventsQueueSubscriber";
import { type IEventsRemover } from "@/common/events/services/interfaces/IEventsRemover";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

@Injectable()
export class EventInbox implements IEventInbox {
    private readonly subscribers: IEventsQueueSubscriber[];
    private readonly connectionName: string;
    private readonly logger;

    public constructor(
        options: IEventInboxOptions,
        private readonly repository: Repository<InboxEventEntity>,
        private readonly eventsRemover: IEventsRemover
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;
        this.subscribers = [];
    }

    public async enqueue(event: IntegrationEvent): Promise<void> {
        const repository = this.getRepository();

        await runInTransaction(
            async () => {
                const exists = await repository.existsBy({ id: event.getId() });

                if (exists) {
                    this.logger.log(event, "Event already in inbox.");
                    return;
                }

                const now = dayjs();

                await repository.save({
                    id: event.getId(),
                    tenantId: event.getTenantId(),
                    topic: event.getTopic(),
                    payload: event.getRawPayload(),
                    isEncrypted: event.isEncrypted(),
                    createdAt: event.getCreatedAt(),
                    receivedAt: now,
                    processAfter: now,
                });

                this.logger.log(event, "Event added to inbox.");

                runOnTransactionCommit(async () => {
                    this.onEventEnqueued(event);
                });
            },
            { connectionName: this.connectionName }
        );
    }

    public subscribe(subscriber: IEventsQueueSubscriber) {
        if (!this.subscribers.includes(subscriber)) {
            this.subscribers.push(subscriber);
        }
    }

    private onEventEnqueued(event: IntegrationEvent) {
        this.subscribers.forEach((subscriber) => subscriber.notifyOnEnqueued(event));
    }

    public async clearProcessedEvents(processedBefore: Date): Promise<void> {
        await this.eventsRemover.removeProcessedBefore(processedBefore, this.getRepository());
    }

    public async clearTenantEvents(tenantId: string): Promise<void> {
        await this.eventsRemover.removeByTenant(tenantId, this.getRepository());
    }

    private getRepository(): Repository<InboxEventEntity> {
        return this.repository;
    }
}
