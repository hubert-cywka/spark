import { CreateDateColumn, Entity, OneToMany, PrimaryColumn, Relation, UpdateDateColumn } from "typeorm";

import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { GoalEntity } from "@/modules/journal/goals/entities/Goal.entity";

@Entity("author")
export class AuthorEntity {
    @PrimaryColumn({ type: "varchar" })
    id!: string;

    @OneToMany((type) => DailyEntity, (daily) => daily.author)
    dailies!: Relation<DailyEntity>[];

    @OneToMany((type) => GoalEntity, (goal) => goal.author)
    goals!: Relation<GoalEntity>[];

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;
}
