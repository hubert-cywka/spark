import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { IPartitionRepository } from "@/common/events/repositories/interfaces/IPartition.repository";

export const OutboxPartitionRepositoryToken = Symbol("OutboxPartitionRepository");

export interface IOutboxPartitionRepository extends IPartitionRepository<OutboxEventPartitionEntity> {
    markAsProcessed(partitionId: number): Promise<void>;
    markAllAsUnprocessed(): Promise<void>;
}
