import { CreateDateColumn, Entity, OneToMany, PrimaryColumn, Relation, UpdateDateColumn } from "typeorm";

import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";

@Entity("author")
export class AuthorEntity {
    @PrimaryColumn({ type: "varchar" })
    id!: string;

    @OneToMany((type) => DailyEntity, (daily) => daily.author, {
        cascade: ["remove"],
    })
    dailies!: Relation<DailyEntity>[];

    @OneToMany((type) => GoalEntity, (goal) => goal.author, {
        cascade: ["remove"],
    })
    goals!: Relation<GoalEntity>[];

    @OneToMany((type) => EntryEntity, (entry) => entry.author, {
        cascade: ["remove"],
    })
    entries!: Relation<EntryEntity>[];

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;
}
