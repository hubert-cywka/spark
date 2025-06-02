import { Injectable, Logger } from "@nestjs/common";
import { runInTransaction, runOnTransactionCommit } from "typeorm-transactional";

import { type IOutboxEventRepository } from "@/common/events/repositories/interfaces/IOutboxEvent.repository";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { type IEventsQueueSubscriber } from "@/common/events/services/interfaces/IEventsQueueSubscriber";
import { type IIntegrationEventsEncryptionService } from "@/common/events/services/interfaces/IIntegrationEventsEncryption.service";
import { type IPartitionAssigner } from "@/common/events/services/interfaces/IPartitionAssigner";
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
        private readonly repository: IOutboxEventRepository,
        private readonly partitionAssigner: IPartitionAssigner,
        private readonly encryptionService: IIntegrationEventsEncryptionService
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;
        this.subscribers = [];
    }

    public async enqueue(event: IntegrationEvent, options?: { encrypt: boolean }): Promise<void> {
        const preparedEvent = await this.prepareEventToStore(event, options);
        const partition = this.partitionAssigner.assign(preparedEvent.getPartitionKey());

        await runInTransaction(
            async () => {
                await this.repository.save({
                    id: preparedEvent.getId(),
                    tenantId: preparedEvent.getTenantId(),
                    partitionKey: preparedEvent.getPartitionKey(),
                    partition,
                    topic: preparedEvent.getTopic(),
                    payload: preparedEvent.getRawPayload(),
                    isEncrypted: preparedEvent.isEncrypted(),
                    createdAt: preparedEvent.getCreatedAt(),
                });

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
}
