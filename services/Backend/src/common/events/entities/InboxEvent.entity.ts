import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("inbox_event")
export class InboxEventEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    topic!: string;

    @Column({ type: "jsonb" })
    payload!: object;

    @Column({ type: "int", default: 0 })
    attempts!: number;

    @Column({ type: "timestamptz" })
    createdAt!: Date;

    @Column({ type: "timestamptz" })
    receivedAt!: Date | null;

    @Column({ type: "timestamptz", nullable: true })
    processedAt!: Date | null;
}
