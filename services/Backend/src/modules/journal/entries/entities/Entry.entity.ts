import {
    type Relation,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";

@Entity("entry")
@Index("idx_entry_pagination", ["authorId", "createdAt", "id"], { where: '"deletedAt" IS NULL' })
@Index("idx_entry_daily", ["authorId", "dailyId"], { where: '"deletedAt" IS NULL' })
export class EntryEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    content!: string;

    @Column({ type: "boolean", default: false })
    isCompleted!: boolean;

    @Column({ type: "boolean", default: false })
    isFeatured!: boolean;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;

    @DeleteDateColumn({ type: "timestamptz", precision: 3, nullable: true })
    deletedAt!: Date | null;

    @ManyToOne((type) => AuthorEntity, (author) => author.entries, {
        onDelete: "CASCADE",
    })
    author!: Relation<AuthorEntity>;

    @Column({ type: "uuid" })
    authorId!: string;

    @ManyToOne((type) => DailyEntity, (daily) => daily.entries)
    daily!: Relation<DailyEntity>;

    @Column({ type: "uuid" })
    dailyId!: string;

    @ManyToMany((type) => GoalEntity, (goal) => goal.entries, {
        onDelete: "CASCADE",
    })
    goals!: Relation<GoalEntity>[];
}
