import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";

export interface IPartitionRepository<T extends IntegrationEventPartitionEntity> {
    getAndLockPartition(partitionId: number): Promise<T | null>;
    getAndLockSingleStalePartition(staleThreshold: Date): Promise<T | null>;
}
