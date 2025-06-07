import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";

export interface IPartitionRepository<T extends IntegrationEventPartitionEntity> {
    invalidatePartition(partitionId: number): Promise<void>;
    invalidateAll(): Promise<void>;

    getAndLockOldestStalePartition(): Promise<T | null>;
    markAsProcessed(partitionId: number, staleAt: Date): Promise<void>;
}
