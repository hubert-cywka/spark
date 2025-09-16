import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";

export const seedPartitions = async (
  app: INestApplication,
  testId: string,
): Promise<void> => {
  const dataSource = app.get<DataSource>(getDataSourceToken(testId));
  const config = app.get<ConfigService>(ConfigService);
  const inboxPartitionRepository = dataSource.getRepository(
    InboxEventPartitionEntity,
  );
  const outboxPartitionRepository = dataSource.getRepository(
    OutboxEventPartitionEntity,
  );
  const outboxPartitionsToInsert: OutboxEventPartitionEntity[] = [];
  const inboxPartitionsToInsert: InboxEventPartitionEntity[] = [];

  const initialNumberOfPartitions = config.getOrThrow<number>(
    "events.partitioning.numberOfPartitions",
  );

  for (let i = 1; i <= initialNumberOfPartitions; i++) {
    outboxPartitionsToInsert.push({
      id: i,
      lastProcessedAt: null,
      staleAt: new Date(),
    });
    inboxPartitionsToInsert.push({
      id: i,
      lastProcessedAt: null,
      staleAt: new Date(),
    });
  }

  await outboxPartitionRepository.insert(outboxPartitionsToInsert);
  await inboxPartitionRepository.insert(inboxPartitionsToInsert);
};
