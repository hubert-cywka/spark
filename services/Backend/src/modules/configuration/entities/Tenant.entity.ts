import { type Relation, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { FeatureFlagEntity } from "@/modules/configuration/entities/FeatureFlag.entity";

@Entity("tenant")
export class TenantEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;

    @OneToMany(() => FeatureFlagEntity, (featureFlag) => featureFlag.tenant)
    featureFlags!: Relation<FeatureFlagEntity[]>;
}
