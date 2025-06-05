import { IsNull, Not, Repository } from "typeorm";

import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { PartitionRepository } from "@/common/events/repositories/implementations/Partition.repository";
import { type IInboxPartitionRepository } from "@/common/events/repositories/interfaces/IInboxPartition.repository";

export class InboxPartitionRepository extends PartitionRepository<InboxEventPartitionEntity> implements IInboxPartitionRepository {
    public constructor(repository: Repository<InboxEventPartitionEntity>) {
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
