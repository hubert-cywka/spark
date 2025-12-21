import { And, IsNull, LessThan, Not, Repository } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { IntegrationEventRepository } from "@/common/events/repositories/implementations/IntegrationEvent.repository";
import {
    type IInboxEventRepository,
    GetBlockedInboxPartitionKeysQueryOptions,
    GetUnprocessedInboxEventsQueryOptions,
    InboxEventInput,
} from "@/common/events/repositories/interfaces/IInboxEvent.repository";
import { RemoveProcessedEventsOptions } from "@/common/events/repositories/interfaces/IIntegrationEvent.repository";

export class InboxEventRepository extends IntegrationEventRepository<InboxEventEntity> implements IInboxEventRepository {
    public constructor(repository: Repository<InboxEventEntity>) {
        super(repository);
    }

    public async save(input: InboxEventInput): Promise<InboxEventEntity> {
        return await this.repository.save(input);
    }

    public async saveManyAndSkipDuplicates(inputs: InboxEventInput[]): Promise<InboxEventEntity[]> {
        const result = await this.repository.createQueryBuilder("events").insert().values(inputs).orIgnore().execute();
        return result.raw as InboxEventEntity[];
    }

    public async exists(id: string): Promise<boolean> {
        return await this.repository.existsBy({ id });
    }

    public async update(events: InboxEventEntity[]) {
        await this.repository.upsert(events, {
            conflictPaths: ["id"],
            skipUpdateIfNoValuesChanged: true,
        });
    }

    public async getBlockedEventsPartitionKeysByPartition({
        partitionId,
        maxAttempts,
    }: GetBlockedInboxPartitionKeysQueryOptions): Promise<string[]> {
        const result = await this.repository
            .createQueryBuilder("event")
            .select("event.partitionKey")
            .distinct(true)
            .where("event.partition = :partitionId", { partitionId })
            .andWhere("event.processAfter > :now", { now: new Date() })
            .andWhere("event.processedAt IS NULL")
            .andWhere("event.attempts < :maxAttempts", { maxAttempts })
            .getMany();

        return result.map(({ partitionKey }) => partitionKey);
    }

    public async getBatchOfUnprocessedEvents({
        take,
        partitionId,
        maxAttempts,
        blockedPartitionKeys,
    }: GetUnprocessedInboxEventsQueryOptions): Promise<InboxEventEntity[]> {
        const baseQuery = this.repository
            .createQueryBuilder("event")
            .where("event.partition = :partitionId", { partitionId })
            .andWhere("event.processedAt IS NULL")
            .andWhere("event.processAfter <= :now", { now: new Date() })
            .andWhere("event.attempts < :maxAttempts", { maxAttempts });

        if (blockedPartitionKeys.length > 0) {
            baseQuery.andWhere("event.partitionKey NOT IN (:...blockedPartitionKeys)", { blockedPartitionKeys });
        }

        return await baseQuery.orderBy("event.sequence", "ASC").take(take).getMany();
    }

    public async removeProcessed({ processedBefore }: RemoveProcessedEventsOptions) {
        await this.repository.delete({
            processedAt: And(LessThan(processedBefore), Not(IsNull())),
        });
    }

    public async removeAll() {
        await this.repository.deleteAll();
    }
}
