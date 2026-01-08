import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { type ISODateString } from "@/types/Date";

@Entity("daily")
@Index("idx_daily_author_date", ["authorId", "date"], { where: '"deletedAt" IS NULL' })
export class DailyEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    date!: ISODateString;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;

    @DeleteDateColumn({ type: "timestamptz", precision: 3, nullable: true })
    deletedAt!: Date | null;

    @Column({ type: "uuid" })
    authorId!: string;
}
