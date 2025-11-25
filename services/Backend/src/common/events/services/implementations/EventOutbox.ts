import {Injectable, Logger} from "@nestjs/common";
import {runInTransaction, runOnTransactionCommit} from "typeorm-transactional";

import {type IOutboxEventRepository} from "@/common/events/repositories/interfaces/IOutboxEvent.repository";
import {type IEventOutbox} from "@/common/events/services/interfaces/IEventOutbox";
import {type IEventsQueueSubscriber} from "@/common/events/services/interfaces/IEventsQueueSubscriber";
import {type IPartitionAssigner} from "@/common/events/services/interfaces/IPartitionAssigner";
import {IntegrationEvent} from "@/common/events/types/IntegrationEvent";

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
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;
        this.subscribers = [];
    }

    public async enqueue(event: IntegrationEvent): Promise<void> {
        await runInTransaction(
            async () => {
                await this.repository.save(this.mapEventToInput(event));
                this.logger.log(event, "Event added to outbox.");

                runOnTransactionCommit(async () => {
                    this.onEventEnqueued(event);
                });
            },
            { connectionName: this.connectionName }
        );
    }

    public async enqueueMany(events: IntegrationEvent[]): Promise<void> {
        const inputs = events.map((event) => this.mapEventToInput(event));

        await runInTransaction(
            async () => {
                const result = await this.repository.saveManyAndSkipDuplicates(inputs);
                this.logger.log({ received: events.length, saved: result.length }, "Events added to outbox.");

                runOnTransactionCommit(async () => {
                    for (const event of events) {
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

    private mapEventToInput(event: IntegrationEvent) {
        return {
            id: event.getId(),
            tenantId: event.getTenantId(),
            partitionKey: event.getPartitionKey(),
            partition: this.partitionAssigner.assign(event.getPartitionKey()),
            topic: event.getTopic(),
            subject: event.getSubject(),
            payload: event.getRawPayload(),
            isEncrypted: event.isEncrypted(),
            createdAt: event.getCreatedAt(),
        };
    }
}
