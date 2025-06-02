import { In, IsNull, LessThan, Repository } from "typeorm";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import {
    GetUnprocessedOutboxEventsQueryOptions,
    IOutboxEventRepository,
    OutboxEventInput,
} from "@/common/events/repositories/interfaces/IOutboxEvent.repository";

export class OutboxEventRepository implements IOutboxEventRepository {
    public constructor(private readonly repository: Repository<OutboxEventEntity>) {}

    public async save(fields: OutboxEventInput): Promise<OutboxEventEntity> {
        const entity = this.repository.create(fields);
        await this.repository.save(entity);
        return entity;
    }

    public async increaseAttempt(ids: string[]): Promise<void> {
        await this.repository.increment({ id: In(ids) }, "attempts", 1);
    }

    public async markAsProcessed(ids: string[]): Promise<void> {
        await this.repository.update(ids, {
            processedAt: new Date(),
        });
    }

    public getBatchOfUnprocessedEvents({
        take,
        partitionId,
        maxAttempts,
    }: GetUnprocessedOutboxEventsQueryOptions): Promise<OutboxEventEntity[]> {
        return this.repository.find({
            where: {
                partition: partitionId,
                processedAt: IsNull(),
                attempts: LessThan(maxAttempts),
            },
            order: {
                createdAt: "ASC",
            },
            take,
        });
    }
}
