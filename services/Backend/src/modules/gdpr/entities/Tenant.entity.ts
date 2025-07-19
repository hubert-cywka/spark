import { type Relation, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { DataPurgePlanEntity } from "@/modules/gdpr/entities/DataPurgePlan.entity";

@Entity("tenant")
export class TenantEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @OneToMany(() => DataPurgePlanEntity, (plan) => plan.tenant)
    dataPurgePlans!: Relation<DataPurgePlanEntity[]>;
}
