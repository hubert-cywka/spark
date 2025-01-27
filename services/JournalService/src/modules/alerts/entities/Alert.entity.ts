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

import { RecipientEntity } from "@/modules/alerts/entities/RecipientEntity";
import { Weekday } from "@/modules/alerts/enums/Weekday.enum";

@Entity("alert")
export class AlertEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "boolean" })
    enabled!: boolean;

    @Column({ type: "time" })
    time!: string;

    @Column("text", { array: true })
    daysOfWeek!: Weekday[];

    @ManyToOne(() => RecipientEntity, (recipient) => recipient.alerts)
    recipient!: Relation<RecipientEntity>;

    @Column({ type: "varchar" })
    recipientId!: string;

    @Column({ type: "timestamptz", nullable: true })
    lastTriggeredAt!: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt!: Date | null;
}
