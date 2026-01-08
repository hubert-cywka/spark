import { CreateDateColumn, Entity, OneToMany, PrimaryColumn, Relation, UpdateDateColumn } from "typeorm";

import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";

@Entity("author")
export class AuthorEntity {
    @PrimaryColumn({ type: "varchar" })
    id!: string;

    @OneToMany((type) => GoalEntity, (goal) => goal.author, {
        cascade: ["remove"],
    })
    goals!: Relation<GoalEntity>[];

    @OneToMany((type) => EntryEntity, (entry) => entry.author, {
        cascade: ["remove"],
    })
    entries!: Relation<EntryEntity>[];

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;
}
