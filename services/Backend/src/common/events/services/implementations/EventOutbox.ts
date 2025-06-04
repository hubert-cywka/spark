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

        await runInTransaction(
            async () => {
                await this.repository.save(this.mapEventToInput(preparedEvent));
                this.logger.log(preparedEvent, "Event added to outbox.");

                runOnTransactionCommit(async () => {
                    this.onEventEnqueued(event);
                });
            },
            { connectionName: this.connectionName }
        );
    }

    public async enqueueMany(events: IntegrationEvent[], options?: { encrypt: boolean }): Promise<void> {
        const promises: Promise<IntegrationEvent>[] = [];

        for (const event of events) {
            promises.push(this.prepareEventToStore(event, options));
        }

        const preparedEvents = await Promise.all(promises);
        const inputs = preparedEvents.map((event) => this.mapEventToInput(event));

        await runInTransaction(
            async () => {
                const result = await this.repository.saveManyAndSkipDuplicates(inputs);
                this.logger.log({ received: events.length, saved: result.length }, "Events added to outbox.");

                runOnTransactionCommit(async () => {
                    for (const event of preparedEvents) {
                        this.onEventEnqueued(event);
                    }
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

    private mapEventToInput(event: IntegrationEvent) {
        return {
            id: event.getId(),
            tenantId: event.getTenantId(),
            partitionKey: event.getPartitionKey(),
            partition: this.partitionAssigner.assign(event.getPartitionKey()),
            topic: event.getTopic(),
            payload: event.getRawPayload(),
            isEncrypted: event.isEncrypted(),
            createdAt: event.getCreatedAt(),
        };
    }
}
