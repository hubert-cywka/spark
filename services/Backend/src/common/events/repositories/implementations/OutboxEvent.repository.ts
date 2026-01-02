import { In, IsNull, LessThan, Repository } from "typeorm";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { IntegrationEventRepository } from "@/common/events/repositories/implementations/IntegrationEvent.repository";
import {
    GetUnprocessedOutboxEventsQueryOptions,
    IOutboxEventRepository,
    OutboxEventInput,
} from "@/common/events/repositories/interfaces/IOutboxEvent.repository";

export class OutboxEventRepository extends IntegrationEventRepository<OutboxEventEntity> implements IOutboxEventRepository {
    public constructor(repository: Repository<OutboxEventEntity>) {
        super(repository);
    }

    public async saveManyAndSkipDuplicates(inputs: OutboxEventInput[]): Promise<OutboxEventEntity[]> {
        const result = await this.repository.createQueryBuilder("events").insert().values(inputs).orIgnore().execute();
        return result.raw as OutboxEventEntity[];
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
                sequence: "ASC",
            },
            take,
        });
    }
}
