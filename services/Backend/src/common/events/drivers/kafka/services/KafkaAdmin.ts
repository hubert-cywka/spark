import { Admin } from "kafkajs";

import { type IEventAdmin } from "@/common/events/drivers/interfaces/IEventAdmin";

export class KafkaAdmin implements IEventAdmin {
    public constructor(private readonly admin: Admin) {}

    public async purgeTopic(topic: string): Promise<void> {
        const { topics } = await this.admin.fetchTopicMetadata({
            topics: [topic],
        });
        const partitions = topics
            .flatMap((topic) => topic.partitions)
            .map((partition) => ({
                partition: partition.partitionId,
                offset: "-1",
            }));

        await this.admin.deleteTopicRecords({ topic, partitions });
    }
}
