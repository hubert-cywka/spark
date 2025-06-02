import { Injectable, Logger } from "@nestjs/common";
import { runInTransaction, runOnTransactionCommit } from "typeorm-transactional";

import { type IInboxEventRepository } from "@/common/events/repositories/interfaces/IInboxEvent.repository";
import { type IEventInbox } from "@/common/events/services/interfaces/IEventInbox";
import { type IEventsQueueSubscriber } from "@/common/events/services/interfaces/IEventsQueueSubscriber";
import { type IPartitionAssigner } from "@/common/events/services/interfaces/IPartitionAssigner";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

interface EventInboxOptions {
    connectionName: string;
    context: string;
}

@Injectable()
export class EventInbox implements IEventInbox {
    private readonly subscribers: IEventsQueueSubscriber[];
    private readonly connectionName: string;
    private readonly logger;

    public constructor(
        options: EventInboxOptions,
        private readonly repository: IInboxEventRepository,
        private readonly partitionAssigner: IPartitionAssigner
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;
        this.subscribers = [];
    }

    public async enqueue(event: IntegrationEvent): Promise<void> {
        await runInTransaction(
            async () => {
                const exists = await this.repository.exists(event.getId());

                if (exists) {
                    this.logger.log(event, "Event already in inbox.");
                    return;
                }

                const now = new Date();
                const partition = this.partitionAssigner.assign(event.getPartitionKey());

                await this.repository.save({
                    id: event.getId(),
                    tenantId: event.getTenantId(),
                    partition,
                    partitionKey: event.getPartitionKey(),
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
}
