import { Column, PrimaryGeneratedColumn } from "typeorm";

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
    topic!: string;

    @Column({ type: "boolean", default: false })
    isEncrypted!: boolean;

    @Column({ type: "jsonb" })
    payload!: T;

    @Column({ type: "int", default: 0 })
    attempts!: number;

    @Column({ type: "timestamptz" })
    createdAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    processedAt!: Date | null;
}
