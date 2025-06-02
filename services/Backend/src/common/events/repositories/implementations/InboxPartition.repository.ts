import { Repository } from "typeorm";

import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { type IInboxPartitionRepository } from "@/common/events/repositories/interfaces/IInboxPartition.repository";

export class InboxPartitionRepository implements IInboxPartitionRepository {
    public constructor(private readonly repository: Repository<InboxEventPartitionEntity>) {}

    public async markAsProcessed(partitionId: number) {
        await this.repository.update(partitionId, {
            lastProcessedAt: new Date(),
        });
    }

    public async getStalePartitionWithLock(partitionId: number, staleThreshold: Date) {
        return await this.repository
            .createQueryBuilder("partition")
            .setLock("pessimistic_write")
            .setOnLocked("skip_locked")
            .where("partition.id = :partitionId", { partitionId })
            .andWhere("partition.lastProcessedAt < :staleThreshold OR partition.lastProcessedAt IS NULL", {
                staleThreshold,
            })
            .getOne();
    }

    public async getStalePartitions(staleThreshold: Date) {
        return await this.repository
            .createQueryBuilder("partition")
            .select("partition.id")
            .where("partition.lastProcessedAt < :staleThreshold", {
                staleThreshold,
            })
            .orWhere("partition.lastProcessedAt IS NULL")
            .getMany();
    }
}
