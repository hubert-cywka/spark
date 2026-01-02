import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { IIntegrationEventRepository } from "@/common/events/repositories/interfaces/IIntegrationEvent.repository";

export const OutboxEventRepositoryToken = Symbol("OutboxEventRepository");

export type GetUnprocessedOutboxEventsQueryOptions = {
    take: number;
    partitionId: number;
    maxAttempts: number;
};

export type OutboxEventInput = Pick<
    OutboxEventEntity<object | string>,
    "id" | "createdAt" | "isEncrypted" | "partitionKey" | "payload" | "topic" | "tenantId" | "partition"
>;

export interface IOutboxEventRepository extends IIntegrationEventRepository<OutboxEventEntity> {
    saveManyAndSkipDuplicates(fields: OutboxEventInput[]): Promise<OutboxEventEntity[]>;

    markAsProcessed(ids: string[]): Promise<void>;
    increaseAttempt(ids: string[]): Promise<void>;

    getBatchOfUnprocessedEvents(options: GetUnprocessedOutboxEventsQueryOptions): Promise<OutboxEventEntity[]>;
}
