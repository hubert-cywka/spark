import { type Relation, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";

@Entity("recipient")
export class RecipientEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @OneToMany(() => AlertEntity, (alert) => alert.recipient)
    alerts!: Relation<AlertEntity[]>;
}
