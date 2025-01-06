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

import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";

@Entity("goal")
export class GoalEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    name!: string;

    @Column({ type: "boolean", default: false })
    isAccomplished!: boolean;

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
}
