import {
    type Relation,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { RecipientEntity } from "@/modules/alerts/entities/Recipient.entity";
import { UTCDay } from "@/modules/alerts/types/UTCDay";

@Entity("alert")
export class AlertEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "boolean" })
    enabled!: boolean;

    @Column({ type: "time" })
    time!: string;

    @Column("int", { array: true })
    daysOfWeek!: UTCDay[];

    @ManyToOne(() => RecipientEntity, (recipient) => recipient.alerts)
    recipient!: Relation<RecipientEntity>;

    @Column({ type: "varchar" })
    recipientId!: string;

    @Column({ type: "timestamptz", nullable: true })
    nextTriggerAt!: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt!: Date | null;
}
