import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";

export const InboxPartitionRepositoryToken = Symbol("InboxPartitionRepository");

export interface IInboxPartitionRepository {
    markAsProcessed(partitionId: number): Promise<void>;
    getStalePartitionWithLock(partitionId: number, staleThreshold: Date): Promise<InboxEventPartitionEntity | null>;
    getStalePartitions(staleThreshold: Date): Promise<InboxEventPartitionEntity[]>;
}
