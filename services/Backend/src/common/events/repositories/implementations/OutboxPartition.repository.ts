import { IsNull, Not, Repository } from "typeorm";

import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { PartitionRepository } from "@/common/events/repositories/implementations/Partition.repository";
import { IOutboxPartitionRepository } from "@/common/events/repositories/interfaces/IOutboxPartition.repository";

export class OutboxPartitionRepository extends PartitionRepository<OutboxEventPartitionEntity> implements IOutboxPartitionRepository {
    public constructor(repository: Repository<OutboxEventPartitionEntity>) {
        super(repository);
    }

    public async markAsProcessed(partitionId: number) {
        await this.repository.update(partitionId, {
            lastProcessedAt: new Date(),
        });
    }

    public async markAllAsUnprocessed() {
        await this.repository.update({ lastProcessedAt: Not(IsNull()) }, { lastProcessedAt: null });
    }
}
