import { type Relation, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";

@Entity("recipient")
export class RecipientEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToMany(() => AlertEntity, (alert) => alert.recipient)
    alerts!: Relation<AlertEntity[]>;
}
