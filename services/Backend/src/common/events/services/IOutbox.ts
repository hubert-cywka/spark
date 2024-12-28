import type { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const OutboxToken = Symbol("Outbox");

export interface IOutbox {
    enqueue(event: IntegrationEvent): Promise<void>;
    process(): Promise<void>;
}
