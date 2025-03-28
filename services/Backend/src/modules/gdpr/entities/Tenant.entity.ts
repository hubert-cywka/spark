import { type Relation, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { DataPurgePlanEntity } from "@/modules/gdpr/entities/DataPurgePlan.entity";

@Entity("tenant")
export class TenantEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToMany(() => DataPurgePlanEntity, (plan) => plan.tenant)
    dataPurgePlans!: Relation<DataPurgePlanEntity[]>;
}
