import {
    type Relation,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { RecipientEntity } from "@/modules/alerts/entities/Recipient.entity";
import { UTCDay } from "@/modules/alerts/types/UTCDay";

@Entity("alert")
@Index("idx_alert_recipient_lookup", ["recipientId", "createdAt"])
@Index("idx_alert_triggering", ["nextTriggerAt", "enabled"], {
    where: '"nextTriggerAt" IS NOT NULL AND "deletedAt" IS NULL',
})
export class AlertEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "boolean" })
    enabled!: boolean;

    @Column({ type: "time" })
    time!: string;

    @Column("int", { array: true })
    daysOfWeek!: UTCDay[];

    @ManyToOne(() => RecipientEntity, (recipient) => recipient.alerts, {
        onDelete: "CASCADE",
    })
    recipient!: Relation<RecipientEntity>;

    @Column({ type: "varchar" })
    recipientId!: string;

    @Column({ type: "timestamptz", precision: 3, nullable: true })
    nextTriggerAt!: Date | null;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;

    @DeleteDateColumn({ type: "timestamptz", precision: 3, nullable: true })
    deletedAt!: Date | null;
}
