import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { IIntegrationEventRepository } from "@/common/events/repositories/interfaces/IIntegrationEvent.repository";

export const InboxEventRepositoryToken = Symbol("InboxEventRepository");

export type GetUnprocessedInboxEventsQueryOptions = {
    take: number;
    partitionId: number;
    maxAttempts: number;
    blockedPartitionKeys: string[];
};

export type GetBlockedInboxPartitionKeysQueryOptions = {
    partitionId: number;
    maxAttempts: number;
};

export type InboxEventInput = Pick<
    InboxEventEntity<object | string>,
    "id" | "createdAt" | "isEncrypted" | "partitionKey" | "payload" | "topic" | "tenantId" | "partition" | "receivedAt" | "processAfter"
>;

export interface IInboxEventRepository extends IIntegrationEventRepository<InboxEventEntity> {
    exists(id: string): Promise<boolean>;
    save(fields: InboxEventInput): Promise<InboxEventEntity>;
    saveManyAndSkipDuplicates(fields: InboxEventInput[]): Promise<InboxEventEntity[]>;

    update(events: InboxEventEntity[]): Promise<void>;

    getBlockedEventsPartitionKeysByPartition(options: GetBlockedInboxPartitionKeysQueryOptions): Promise<string[]>;
    getBatchOfUnprocessedEvents(options: GetUnprocessedInboxEventsQueryOptions): Promise<InboxEventEntity[]>;
}
