import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { NatsJetStreamClientProxy, NatsJetStreamRecordBuilder } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import dayjs from "dayjs";
import { PubAck } from "nats";
import { timeout } from "rxjs";
import { And, IsNull, LessThan, Not, Repository } from "typeorm";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

const MAX_PAGE_SIZE = 10;
const MAX_ATTEMPTS = 10;
const PUBLISH_TIMEOUT = 1000;

@Injectable()
export class EventOutbox implements IEventOutbox {
    private readonly logger;

    public constructor(
        private client: NatsJetStreamClientProxy,
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
        this.logger.log(event, "Event added to outbox.");
    }

    public async clearProcessedEvents(processedBefore: Date): Promise<void> {
        try {
            const result = await this.getRepository().delete({
                processedAt: And(LessThan(processedBefore), Not(IsNull())),
            });
            const count = result.affected ?? 0;
            this.logger.log({ processedBefore, count }, "Removed old events.");
        } catch (err) {
            this.logger.error({ processedBefore, err }, "Failed to remove old events.");
        }
    }

    public async process() {
        let totalProcessed = 0;
        let processedInRecentBatch = Infinity;

        while (processedInRecentBatch !== 0) {
            processedInRecentBatch = await this.processBatch(MAX_PAGE_SIZE, totalProcessed);
            totalProcessed += processedInRecentBatch;
        }

        this.logger.log({ count: totalProcessed }, "Processed events");
    }

    private async processBatch(pageSize: number, offset: number) {
        return await this.txHost.withTransaction(async () => {
            const repository = this.getRepository();

            const entities = await repository
                .createQueryBuilder("event")
                .setLock("pessimistic_write")
                .setOnLocked("skip_locked")
                .where(`event.processedAt IS NULL AND event.attempts < ${MAX_ATTEMPTS}`)
                .orderBy("event.createdAt", "ASC")
                .take(pageSize)
                .skip(offset)
                .getMany();

            if (!entities.length) {
                return 0;
            }

            const publishPromises = entities.map((event) => this.publish(event));
            const processedEvents = await Promise.all(publishPromises);
            await repository.save(processedEvents);
            return entities.length;
        });
    }

    private async publish(entity: OutboxEventEntity): Promise<OutboxEventEntity> {
        const event = IntegrationEvent.fromEntity(entity);

        const builder = new NatsJetStreamRecordBuilder();
        builder.setMsgId(event.getId());
        builder.setPayload(event);
        const record = builder.build();

        return await new Promise((resolve) => {
            try {
                this.client
                    .emit<PubAck>(event.getTopic(), record)
                    .pipe(timeout(PUBLISH_TIMEOUT))
                    .subscribe((ack) => {
                        this.logger.log({ event, ack }, "Published event");
                        return resolve({
                            ...entity,
                            processedAt: dayjs().toDate(),
                            attempts: ++entity.attempts,
                        });
                    });
            } catch (e) {
                this.logger.error({ event, e }, "Failed to publish event - ACK not received");
                return resolve({
                    ...entity,
                    attempts: ++entity.attempts,
                });
            }
        });
    }

    private getRepository(): Repository<OutboxEventEntity> {
        return this.txHost.tx.getRepository(OutboxEventEntity);
    }
}
