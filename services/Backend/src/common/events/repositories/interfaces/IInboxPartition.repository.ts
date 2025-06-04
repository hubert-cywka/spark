import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { IPartitionRepository } from "@/common/events/repositories/interfaces/IPartition.repository";

export const InboxPartitionRepositoryToken = Symbol("InboxPartitionRepository");

export interface IInboxPartitionRepository extends IPartitionRepository<InboxEventPartitionEntity> {
    markAsProcessed(partitionId: number): Promise<void>;
    markAllAsUnprocessed(): Promise<void>;
}
