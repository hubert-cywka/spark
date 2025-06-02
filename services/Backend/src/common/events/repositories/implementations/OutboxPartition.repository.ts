import { Repository } from "typeorm";

import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { IOutboxPartitionRepository } from "@/common/events/repositories/interfaces/IOutboxPartition.repository";

export class OutboxPartitionRepository implements IOutboxPartitionRepository {
    public constructor(private readonly repository: Repository<OutboxEventPartitionEntity>) {}

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
