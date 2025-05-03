import { ConfigService } from "@nestjs/config";
import { classToPlain } from "class-transformer";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { AesGcmEncryptionAlgorithm } from "@/common/services/implementations/AesGcmEncryptionAlgorithm";
import { AppConfig } from "@/config/configuration";

// TODO: Better way to encrypt/decrypt (including type safety).
export class IntegrationEvent<T = unknown> {
    private readonly id: string;
    private readonly topic: string;
    private readonly tenantId: string;
    private readonly createdAt: Date;

    private encrypted: boolean;
    private payload: string | T;

    public constructor(
        tenantId: string,
        topic: string,
        payload: T,
        createdAt: Date = new Date(),
        id: string = crypto.randomUUID(),
        isEncrypted: boolean = false
    ) {
        this.id = id;
        this.topic = topic;
        this.payload = payload;
        this.createdAt = createdAt;
        this.tenantId = tenantId;
        this.encrypted = isEncrypted;
    }

    public static fromEntity<T = unknown>(entity: OutboxEventEntity<T> | InboxEventEntity<T>): IntegrationEvent<T> {
        return new IntegrationEvent<T>(entity.tenantId, entity.topic, entity.payload, entity.createdAt, entity.id, entity.isEncrypted);
    }

    public toPlain(): object {
        return classToPlain(this);
    }

    public getTopic(): string {
        return this.topic;
    }

    public async getPayload(): Promise<T> {
        if (!this.encrypted) {
            return this.payload as T;
        }

        return await this.getEncryptionAlgorithm().decrypt<T>(this.payload as string);
    }

    public getRawPayload(): string | T {
        return this.payload;
    }

    public isEncrypted(): boolean {
        return this.encrypted;
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

    public async encrypt() {
        if (this.encrypted) {
            return;
        }

        this.encrypted = true;
        this.payload = (await this.getEncryptionAlgorithm().encrypt(this.payload)) as T;
    }

    public async decrypt() {
        if (!this.encrypted) {
            return;
        }

        this.encrypted = false;
        this.payload = await this.getEncryptionAlgorithm().decrypt(this.payload as string);
    }

    // TODO: I don't like this.
    private getEncryptionAlgorithm() {
        const config = new ConfigService(AppConfig());
        const secretKey = config.getOrThrow<string>("events.encryption.secret");
        return new AesGcmEncryptionAlgorithm(secretKey);
    }
}
