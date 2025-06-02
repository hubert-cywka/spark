import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";

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
    InboxEventEntity,
    "id" | "createdAt" | "isEncrypted" | "partitionKey" | "payload" | "topic" | "tenantId" | "partition" | "receivedAt" | "processAfter"
>;

export interface IInboxEventRepository {
    save(fields: InboxEventInput): Promise<InboxEventEntity>;
    exists(id: string): Promise<boolean>;

    markAsProcessed(events: InboxEventEntity[]): Promise<void>;
    markAsPostponed(events: InboxEventEntity[], postponeTimeResolver: (attempt: number) => Date): Promise<void>;

    getBlockedEventsPartitionKeysByPartition(options: GetBlockedInboxPartitionKeysQueryOptions): Promise<string[]>;
    getBatchOfUnprocessedEvents(options: GetUnprocessedInboxEventsQueryOptions): Promise<InboxEventEntity[]>;
}
