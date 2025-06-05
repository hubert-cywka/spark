import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";

export interface IPartitionRepository<T extends IntegrationEventPartitionEntity> {
    getAndLockPartition(partitionId: number): Promise<T | null>;
    getAndLockOldestStalePartition(staleThreshold: Date): Promise<T | null>;
}
