import { type Relation, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";

@Entity("recipient")
export class RecipientEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    email!: string;

    @OneToMany(() => AlertEntity, (alert) => alert.recipient, {
        onDelete: "CASCADE",
    })
    alerts!: Relation<AlertEntity[]>;
}
