import { ObjectType, Repository } from "typeorm";

import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";
import { IPartitionRepository } from "@/common/events/repositories/interfaces/IPartition.repository";

export abstract class PartitionRepository<T extends IntegrationEventPartitionEntity> implements IPartitionRepository<T> {
    protected constructor(
        protected readonly repository: Repository<T>,
        protected readonly entity: ObjectType<IntegrationEventPartitionEntity>
    ) {}

    public async invalidatePartition(partitionId: number): Promise<void> {
        const now = new Date();

        await this.repository
            .createQueryBuilder("partition")
            .update(this.entity)
            .set({ staleAt: now })
            .where("id = :partitionId", { partitionId })
            .andWhere("staleAt >= :now", { now })
            .execute();
    }

    public async invalidateAll() {
        const now = new Date();

        await this.repository
            .createQueryBuilder("partition")
            .update(this.entity)
            .set({ staleAt: now })
            .andWhere("staleAt >= :now", { now })
            .execute();
    }

    public async markAsProcessed(partitionId: number, staleAt: Date) {
        const now = new Date();

        await this.repository
            .createQueryBuilder("partition")
            .update(this.entity)
            .set({ lastProcessedAt: now, staleAt })
            .where("id = :partitionId", { partitionId })
            .andWhere("staleAt < :now", { now })
            .execute();
    }

    public async getAndLockOldestStalePartition(): Promise<T | null> {
        return await this.repository
            .createQueryBuilder("partition")
            .setLock("pessimistic_write")
            .setOnLocked("skip_locked")
            .where("partition.staleAt <= :now", { now: new Date() })
            .orderBy("partition.lastProcessedAt", "ASC", "NULLS FIRST")
            .addOrderBy("partition.id", "ASC")
            .limit(1)
            .getOne();
    }
}
