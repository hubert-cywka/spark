import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";

export class IntegrationEvent<T = unknown> {
    private readonly topic: string;
    private readonly payload: T;
    private readonly id: string;
    private readonly tenantId: string;
    private readonly createdAt: Date;

    public constructor(tenantId: string, topic: string, payload: T, createdAt: Date = new Date(), id: string = crypto.randomUUID()) {
        this.topic = topic;
        this.payload = payload;
        this.createdAt = createdAt;
        this.tenantId = tenantId;
        this.id = id;
    }

    public static fromEntity<T = unknown>(entity: OutboxEventEntity<T> | InboxEventEntity<T>): IntegrationEvent<T> {
        return new IntegrationEvent<T>(entity.tenantId, entity.topic, entity.payload, entity.createdAt, entity.id);
    }

    public getTopic(): string {
        return this.topic;
    }

    public getPayload(): T {
        return this.payload;
    }

    public getId(): string {
        return this.id;
    }

    public getTenantId(): string {
        return this.tenantId;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}
