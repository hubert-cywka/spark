import { type Relation, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { DataPurgePlanEntity } from "@/modules/privacy/entities/DataPurgePlan.entity";

@Entity("tenant")
export class TenantEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;

    @OneToMany(() => DataPurgePlanEntity, (plan) => plan.tenant)
    dataPurgePlans!: Relation<DataPurgePlanEntity[]>;
}
