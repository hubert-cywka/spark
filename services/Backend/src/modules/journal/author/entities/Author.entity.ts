import { CreateDateColumn, Entity, OneToMany, PrimaryColumn, Relation, UpdateDateColumn } from "typeorm";

import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";

@Entity("author")
export class AuthorEntity {
    @PrimaryColumn({ type: "varchar" })
    id!: string;

    @OneToMany((type) => DailyEntity, (daily) => daily.author)
    dailies!: Relation<DailyEntity>[];

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;
}
