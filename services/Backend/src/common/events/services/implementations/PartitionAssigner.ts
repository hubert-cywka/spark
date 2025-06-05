import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IPartitionAssigner } from "@/common/events/services/interfaces/IPartitionAssigner";
import { numberFromString } from "@/common/utils/hashUtils";

@Injectable()
export class PartitionAssigner implements IPartitionAssigner {
    private readonly numberOfPartitions: number;

    public constructor(config: ConfigService) {
        this.numberOfPartitions = config.getOrThrow<number>("events.partitioning.numberOfPartitions");
    }

    public assign(partitionKey: string) {
        return numberFromString(partitionKey, this.numberOfPartitions);
    }
}
