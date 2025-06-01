import { Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { In, IsNull, LessThan, Repository } from "typeorm";
import { runInTransaction } from "typeorm-transactional";

import { IntegrationEvent } from "@/common/events";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { type IEventOutboxProcessor } from "@/common/events/services/interfaces/IEventOutboxProcessor";
import { type IPartitionAssigner } from "@/common/events/services/interfaces/IPartitionAssigner";
import { type IPubSubProducer } from "@/common/events/services/interfaces/IPubSubProducer";

const DEFAULT_MAX_BATCH_SIZE = 50;
const DEFAULT_MAX_ATTEMPTS = 10_000;
const TOTAL_NUMBER_OF_PARTITIONS = 16; // TODO: Move to config
const DEFAULT_STALE_PARTITION_THRESHOLD_MILLISECONDS = 10_000;

export interface EventOutboxProcessorOptions {
    connectionName: string;
    context: string;
    stalePartitionThreshold?: number;
    maxAttempts?: number;
    maxBatchSize?: number;
}

/*
  Kluczowe decyzje projektowe (nowa wersja):
  1. Gwarancja kolejności w ramach partycji jest najważniejsza.
  2. Przetwarzanie partycji jest atomowe z perspektywy innych instancji serwisu dzięki blokadzie pesymistycznej.
  3. Operacje sieciowe (publikacja) są wykonywane POZA transakcją bazodanową, aby nie blokować zasobów bazy danych na długo.
  4. Aktualizacja stanu zdarzeń i partycji odbywa się w krótkiej, wydajnej transakcji.
  5. Dwa mechanizmy wyzwalania:
     - Natychmiastowy (`notifyOnEnqueued`): dla niskiego opóźnienia.
     - Polling (`pollAndProcessStalePartitions`): dla gwarancji dostarczenia (gdyby powiadomienie zawiodło lub instancja padła).
*/
export class EventOutboxProcessor implements IEventOutboxProcessor {
    private readonly logger: Logger;
    private readonly connectionName: string;

    private readonly stalePartitionThreshold: number;
    private readonly maxAttempts: number;
    private readonly maxBatchSize: number;

    public constructor(
        private readonly client: IPubSubProducer,
        private readonly eventsRepository: Repository<OutboxEventEntity>,
        private readonly partitionsRepository: Repository<OutboxEventPartitionEntity>,
        private readonly partitionAssigner: IPartitionAssigner,
        options: EventOutboxProcessorOptions
    ) {
        this.logger = new Logger(options.context);
        this.connectionName = options.connectionName;

        this.stalePartitionThreshold = options.stalePartitionThreshold ?? DEFAULT_STALE_PARTITION_THRESHOLD_MILLISECONDS;
        this.maxBatchSize = options.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE;
        this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
    }

    public notifyOnEnqueued(event: IntegrationEvent): void {
        const partition = this.partitionAssigner.assign(event.getPartitionKey());
        void this.processPartition(partition);
    }

    public async processPendingEvents(): Promise<void> {
        this.logger.log("Polling for stale partitions to process...");
        const staleThreshold = dayjs().subtract(this.stalePartitionThreshold, "milliseconds").toDate();

        try {
            const stalePartitions = await this.partitionsRepository
                .createQueryBuilder("partition")
                .select("partition.id")
                .where("partition.lastProcessedAt < :staleThreshold", {
                    staleThreshold,
                })
                .orWhere("partition.lastProcessedAt IS NULL")
                .getMany();

            if (stalePartitions.length === 0) {
                this.logger.log("No stale partitions found.");
                return;
            }

            this.logger.log({ count: stalePartitions.length }, "Found stale partitions. Processing...");

            for (const partition of stalePartitions) {
                await this.processPartition(partition.id);
            }

            this.logger.log({ count: stalePartitions.length }, "Processed stale partitions.");
        } catch (error) {
            this.logger.error(error, "Failed to poll and process stale partitions.");
        }
    }

    private async processPartition(partitionId: number): Promise<void> {
        let process = true;

        await runInTransaction(
            async () => {
                const partition = await this.acquirePartitionLock(partitionId);

                if (!partition) {
                    return;
                }

                while (process) {
                    const events = await this.fetchNextBatchOfEvents(partitionId);
                    const { successfulEvents, failedEvent } = await this.publishEvents(events);
                    await this.updateEventsAndPartition(partition, successfulEvents, events);

                    if (failedEvent) {
                        this.logger.warn(
                            { partitionId, failedEventId: failedEvent.id },
                            "Stopped processing partition due to publish failure."
                        );
                        process = false;
                        break;
                    }

                    if (events.length < this.maxBatchSize) {
                        process = false;
                        break;
                    }
                }
            },
            { connectionName: this.connectionName }
        );
    }

    private async acquirePartitionLock(partitionId: number): Promise<OutboxEventPartitionEntity | null> {
        try {
            return await this.partitionsRepository
                .createQueryBuilder("partition")
                .setLock("pessimistic_write")
                .setOnLocked("skip_locked")
                .where("partition.id = :partitionId", { partitionId })
                .getOne();
        } catch (error) {
            this.logger.error(`Failed to acquire lock for partition ${partitionId}`, error);
            return null;
        }
    }

    private async fetchNextBatchOfEvents(partitionId: number): Promise<OutboxEventEntity[]> {
        return this.eventsRepository.find({
            where: {
                partition: partitionId,
                processedAt: IsNull(),
                attempts: LessThan(this.maxAttempts),
            },
            order: {
                createdAt: "ASC",
            },
            take: this.maxBatchSize,
        });
    }

    private async publishEvents(events: OutboxEventEntity[]) {
        const successfulEvents: OutboxEventEntity[] = [];
        let failedEvent: OutboxEventEntity | null = null;

        for (const eventEntity of events) {
            const event = IntegrationEvent.fromEntity(eventEntity);

            try {
                await this.client.publish(event);
                successfulEvents.push(eventEntity);
                this.logger.log({ eventId: event.getId() }, "Published event");
            } catch (error) {
                this.logger.error(error, "Failed to publish event. ACK not received.");
                failedEvent = eventEntity;
                break;
            }
        }

        return { successfulEvents, failedEvent };
    }

    private async updateEventsAndPartition(
        partition: OutboxEventPartitionEntity,
        successfulEvents: OutboxEventEntity[],
        allAttemptedEvents: OutboxEventEntity[]
    ) {
        const eventRepository = this.getEventRepository();
        const partitionRepository = this.getPartitionRepository();

        const allAttemptedEventIds = allAttemptedEvents.map((e) => e.id);
        const successfulEventIds = successfulEvents.map((e) => e.id);

        if (allAttemptedEventIds.length > 0) {
            await eventRepository.increment({ id: In(allAttemptedEventIds) }, "attempts", 1);
        }

        if (successfulEventIds.length > 0) {
            await eventRepository.update(successfulEventIds, {
                processedAt: new Date(),
            });
        }

        await partitionRepository.update(partition.id, {
            lastProcessedAt: new Date(),
        });
    }

    private getEventRepository(): Repository<OutboxEventEntity> {
        return this.eventsRepository;
    }

    private getPartitionRepository(): Repository<OutboxEventPartitionEntity> {
        return this.partitionsRepository;
    }
}
