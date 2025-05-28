import { Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { runInTransaction, runOnTransactionCommit } from "typeorm-transactional";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { type IEventsQueueSubscriber } from "@/common/events/services/interfaces/IEventsQueueSubscriber";
import { type IIntegrationEventsEncryptionService } from "@/common/events/services/interfaces/IIntegrationEventsEncryption.service";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

interface EventOutboxOptions {
    connectionName: string;
    context: string;
}

@Injectable()
export class EventOutbox implements IEventOutbox {
    private readonly subscribers: IEventsQueueSubscriber[];
    private readonly connectionName: string;
    private readonly logger;

    public constructor(
        options: EventOutboxOptions,
        private readonly repository: Repository<OutboxEventEntity>,
        private readonly encryptionService: IIntegrationEventsEncryptionService
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;
        this.subscribers = [];
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

    private async prepareEventToStore(event: IntegrationEvent, options?: { encrypt: boolean }): Promise<IntegrationEvent> {
        if (options?.encrypt) {
            return await this.encryptionService.encrypt(event.copy());
        }

        return event.copy();
    }

    private getRepository(): Repository<OutboxEventEntity> {
        return this.repository;
    }
}
