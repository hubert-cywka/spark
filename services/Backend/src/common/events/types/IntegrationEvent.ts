import { classToPlain } from "class-transformer";
import { deserialize, serialize } from "v8";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { PayloadEncryptedError } from "@/common/events/errors/PayloadEncrypted.error";

type IntegrationEventMetadata = {
    id?: string;
    createdAt?: Date;
};

type RequiredIntegrationEventFields<T = unknown> = {
    topic: string;
    tenantId: string;
    partitionKey: string;
    payload: T;
};

type IntegrationEventFields<T = unknown> = IntegrationEventMetadata & RequiredIntegrationEventFields<T>;

export class IntegrationEvent<T = unknown> {
    private readonly id: string;
    private readonly partitionKey: string;
    private readonly tenantId: string;
    private readonly topic: string;
    private readonly payload: T;
    private readonly createdAt: Date;

    public constructor({
        tenantId,
        partitionKey,
        topic,
        payload,
        id = crypto.randomUUID(),
        createdAt = new Date(),
    }: IntegrationEventFields<T>) {
        this.id = id;
        this.topic = topic;
        this.payload = payload;
        this.createdAt = createdAt;
        this.tenantId = tenantId;
        this.partitionKey = partitionKey;
    }

    public static fromEntity<T = unknown>(entity: OutboxEventEntity<T> | InboxEventEntity<T>): IntegrationEvent<T> {
        return new IntegrationEvent<T>({
            createdAt: entity.createdAt,
            payload: entity.payload,
            tenantId: entity.tenantId,
            partitionKey: entity.partitionKey,
            topic: entity.topic,
            id: entity.id,
        });
    }

    public static fromPlain<T = unknown>(plain: IntegrationEventFields<T>): IntegrationEvent<T> {
        return new IntegrationEvent<T>({
            createdAt: plain.createdAt,
            payload: plain.payload,
            tenantId: plain.tenantId,
            partitionKey: plain.partitionKey,
            topic: plain.topic,
            id: plain.id,
        });
    }

    public toPlain(): object {
        return classToPlain(this);
    }

    public copy(overrides: Partial<RequiredIntegrationEventFields<T>> = {}) {
        return new IntegrationEvent<T>({
            id: this.id,
            createdAt: this.createdAt,
            payload: this.payload,
            topic: this.topic,
            tenantId: this.tenantId,
            partitionKey: this.partitionKey,
            ...overrides,
        });
    }

    public static fromBuffer<T = unknown>(buffer: Buffer): IntegrationEvent<T> {
        return IntegrationEvent.fromPlain(deserialize(buffer));
    }

    public toBuffer(): Buffer {
        return serialize(this);
    }

    public getTopic(): string {
        return this.topic;
    }

    public getPayload(): T {
        if (this.isEncrypted()) {
            throw new PayloadEncryptedError();
        }

        return this.payload;
    }

    public getRawPayload(): string | T {
        return this.payload;
    }

    public isEncrypted(): boolean {
        return typeof this.getRawPayload() === "string";
    }

    public getId(): string {
        return this.id;
    }

    public getTenantId(): string {
        return this.tenantId;
    }

    public getPartitionKey(): string {
        return this.partitionKey;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}
