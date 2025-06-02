import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";

export const OutboxPartitionRepositoryToken = Symbol("OutboxPartitionRepository");

export interface IOutboxPartitionRepository {
    markAsProcessed(partitionId: number): Promise<void>;
    getStalePartitionWithLock(partitionId: number, staleThreshold: Date): Promise<OutboxEventPartitionEntity | null>;
    getStalePartitions(staleThreshold: Date): Promise<OutboxEventPartitionEntity[]>;
}
