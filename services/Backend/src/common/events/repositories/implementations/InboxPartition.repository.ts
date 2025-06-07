import { Repository } from "typeorm";

import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { PartitionRepository } from "@/common/events/repositories/implementations/Partition.repository";
import { type IInboxPartitionRepository } from "@/common/events/repositories/interfaces/IInboxPartition.repository";

export class InboxPartitionRepository extends PartitionRepository<InboxEventPartitionEntity> implements IInboxPartitionRepository {
    public constructor(repository: Repository<InboxEventPartitionEntity>) {
        super(repository, InboxEventPartitionEntity);
    }
}
