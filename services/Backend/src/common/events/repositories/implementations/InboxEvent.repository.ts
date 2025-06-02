import { Repository } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import {
    type IInboxEventRepository,
    GetBlockedInboxPartitionKeysQueryOptions,
    GetUnprocessedInboxEventsQueryOptions,
    InboxEventInput,
} from "@/common/events/repositories/interfaces/IInboxEvent.repository";

export class InboxEventRepository implements IInboxEventRepository {
    public constructor(private readonly repository: Repository<InboxEventEntity>) {}

    public async save(fields: InboxEventInput): Promise<InboxEventEntity> {
        return await this.repository.save(fields);
    }

    public async exists(id: string): Promise<boolean> {
        return await this.repository.existsBy({ id });
    }

    public async markAsPostponed(events: InboxEventEntity[], postponeTimeResolver: (attempt: number) => Date) {
        await this.repository.save(
            events.map((event) => {
                const attempts = event.attempts + 1;

                return {
                    ...event,
                    attempts,
                    processAfter: postponeTimeResolver(attempts),
                };
            })
        );
    }

    public async markAsProcessed(events: InboxEventEntity[]) {
        await this.repository.save(
            events.map((event) => {
                const attempts = event.attempts + 1;

                return {
                    ...event,
                    attempts,
                    processedAt: new Date(),
                };
            })
        );
    }

    public async getBlockedEventsPartitionKeysByPartition({
        partitionId,
        maxAttempts,
    }: GetBlockedInboxPartitionKeysQueryOptions): Promise<string[]> {
        const result = await this.repository
            .createQueryBuilder("event")
            .select("event.partitionKey")
            .where("event.partition = :partitionId", { partitionId })
            .andWhere("event.processAfter > :now", { now: new Date() })
            .andWhere("event.processedAt IS NULL")
            .andWhere("event.attempts <= :maxAttempts", { maxAttempts })
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

        return await baseQuery.orderBy("event.createdAt", "ASC").take(take).getMany();
    }
}
