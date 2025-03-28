import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { NatsJetStreamClientProxy, NatsJetStreamRecordBuilder } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import dayjs from "dayjs";
import { PubAck } from "nats";
import { firstValueFrom, timeout } from "rxjs";
import { And, IsNull, LessThan, Not, Repository } from "typeorm";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

const MAX_PAGE_SIZE = 10;
const MAX_ATTEMPTS = 10;
const PUBLISH_TIMEOUT = 1000;

// TODO: Implement better retry mechanism
// TODO: CDC instead of polling?
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
            tenantId: event.getTenantId(),
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
        let totalSuccessful = 0;
        let totalProcessed = 0;
        let breakpoint = true;

        while (breakpoint) {
            const { total, successful } = await this.processBatch(MAX_PAGE_SIZE, totalProcessed);
            totalProcessed += total;
            totalSuccessful += successful;

            if (total === 0) {
                breakpoint = false;
            }
        }

        if (totalProcessed !== 0) {
            this.logger.log(
                {
                    processed: {
                        total: totalProcessed,
                        successful: totalSuccessful,
                    },
                },
                "Processed events"
            );
        }
    }

    public async clearTenantEvents(tenantId: string): Promise<void> {
        await this.txHost.withTransaction(async () => {
            const repository = this.getRepository();
            const result = await repository.delete({ tenantId });
            this.logger.log({ tenantId, events: result.affected }, "Deleted tenant's events.");
        });
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
                return { successful: 0, total: 0 };
            }

            const publishPromises = entities.map((event) => this.publish(event));
            const processedEvents = await Promise.all(publishPromises);
            const processedSuccessfully = processedEvents.filter((event) => !!event.processedAt);
            await repository.save(processedEvents);

            return {
                total: processedEvents.length,
                successful: processedSuccessfully.length,
            };
        });
    }

    private async publish(entity: OutboxEventEntity): Promise<OutboxEventEntity> {
        const event = IntegrationEvent.fromEntity(entity);

        const builder = new NatsJetStreamRecordBuilder();
        builder.setMsgId(event.getId());
        builder.setPayload(event);
        const record = builder.build();

        try {
            const ack = await firstValueFrom(this.client.emit<PubAck>(event.getTopic(), record).pipe(timeout(PUBLISH_TIMEOUT)));
            this.logger.log({ event, ack }, "Published event");
            entity.processedAt = dayjs().toDate();
        } catch (e) {
            this.logger.error({ event, e }, "Failed to publish event - ACK not received");
        }

        entity.attempts++;
        return entity;
    }

    private getRepository(): Repository<OutboxEventEntity> {
        return this.txHost.tx.getRepository(OutboxEventEntity);
    }
}
