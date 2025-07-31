import { Column, PrimaryGeneratedColumn } from "typeorm";

import { type IntegrationEventSubject, type IntegrationEventTopic } from "@/common/events/types";

export class IntegrationEventEntity<T = string | object> {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    tenantId!: string;

    @Column({ type: "varchar" })
    partitionKey!: string;

    @Column({ type: "int" })
    partition!: number;

    @Column({ type: "varchar" })
    topic!: IntegrationEventTopic;

    @Column({ type: "varchar" })
    subject!: IntegrationEventSubject;

    @Column({ type: "boolean", default: false })
    isEncrypted!: boolean;

    @Column({ type: "jsonb" })
    payload!: T;

    @Column({ type: "bigint", generated: "increment" })
    sequence!: number;

    @Column({ type: "int", default: 0 })
    attempts!: number;

    @Column({ type: "timestamptz" })
    createdAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    processedAt!: Date | null;
}
