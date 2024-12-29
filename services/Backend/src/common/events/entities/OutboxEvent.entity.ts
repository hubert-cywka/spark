import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("outbox_event")
export class OutboxEventEntity<T = unknown> {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    topic!: string;

    @Column({ type: "jsonb" })
    payload!: T;

    @Column({ type: "int", default: 0 })
    attempts!: number;

    @Column({ type: "timestamptz" })
    createdAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    processedAt!: Date | null;
}
