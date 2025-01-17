import {
    type Relation,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";

@Entity("goal")
export class GoalEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    name!: string;

    @Column({ type: "smallint" })
    target!: number;

    @Column({ type: "timestamptz", nullable: true })
    deadline!: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt!: Date | null;

    @ManyToOne((type) => AuthorEntity, (author) => author.goals)
    author!: Relation<AuthorEntity>;
    authorId!: string;

    @ManyToMany((type) => EntryEntity, (entry) => entry.goals)
    @JoinTable({ name: "goal_entries" })
    entries!: Relation<EntryEntity>[];
}
