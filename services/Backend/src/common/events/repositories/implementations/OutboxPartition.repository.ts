import { Repository } from "typeorm";

import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { PartitionRepository } from "@/common/events/repositories/implementations/Partition.repository";
import { IOutboxPartitionRepository } from "@/common/events/repositories/interfaces/IOutboxPartition.repository";

export class OutboxPartitionRepository extends PartitionRepository<OutboxEventPartitionEntity> implements IOutboxPartitionRepository {
    public constructor(repository: Repository<OutboxEventPartitionEntity>) {
        super(repository, OutboxEventPartitionEntity);
    }
}
