import { Repository } from "typeorm";

import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";
import { IPartitionRepository } from "@/common/events/repositories/interfaces/IPartition.repository";

export class PartitionRepository<T extends IntegrationEventPartitionEntity = IntegrationEventPartitionEntity>
    implements IPartitionRepository<T>
{
    public constructor(protected readonly repository: Repository<T>) {}

    public async getAndLockPartition(partitionId: number): Promise<T | null> {
        return await this.repository
            .createQueryBuilder("partition")
            .setLock("pessimistic_write")
            .setOnLocked("skip_locked")
            .where("partition.id = :partitionId", { partitionId })
            .getOne();
    }

    public async getAndLockOldestStalePartition(staleThreshold: Date): Promise<T | null> {
        return await this.repository
            .createQueryBuilder("partition")
            .setLock("pessimistic_write")
            .setOnLocked("skip_locked")
            .where("partition.lastProcessedAt <= :staleThreshold OR partition.lastProcessedAt IS NULL", {
                staleThreshold,
            })
            .orderBy("partition.lastProcessedAt", "ASC")
            .addOrderBy("partition.id", "ASC")
            .limit(1)
            .getOne();
    }
}
