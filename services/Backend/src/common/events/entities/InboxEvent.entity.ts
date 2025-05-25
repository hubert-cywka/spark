import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("inbox_event")
export class InboxEventEntity<T = unknown> {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    tenantId!: string;

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

    @Column({ type: "timestamptz" })
    receivedAt!: Date;

    @Column({ type: "timestamptz" })
    processAfter!: Date;

    @Column({ type: "timestamptz", nullable: true })
    processedAt!: Date | null;
}
