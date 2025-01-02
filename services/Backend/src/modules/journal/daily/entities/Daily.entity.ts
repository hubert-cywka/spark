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

import { AuthorEntity } from "@/modules/journal/author/entities/Author.entity";

@Entity("daily")
export class DailyEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "date" })
    date!: Date;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt!: Date | null;

    @ManyToOne((type) => AuthorEntity, (author) => author.dailies)
    author!: Relation<AuthorEntity>;
}
