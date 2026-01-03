import {
    type Relation,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { type ISODateString } from "@/types/Date";

@Entity("daily")
@Index("idx_daily_author_date", ["authorId", "date"], { where: '"deletedAt" IS NULL' })
export class DailyEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    date!: ISODateString;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt!: Date | null;

    @ManyToOne((type) => AuthorEntity, (author) => author.dailies, {
        onDelete: "CASCADE",
    })
    author!: Relation<AuthorEntity>;

    @Column({ type: "uuid" })
    authorId!: string;

    @OneToMany((type) => EntryEntity, (entry) => entry.daily, {
        cascade: ["remove", "soft-remove"],
    })
    entries!: Relation<EntryEntity>[];
}
