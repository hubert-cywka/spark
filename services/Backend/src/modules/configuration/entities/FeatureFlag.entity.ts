import {
    type Relation,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { TenantEntity } from "@/modules/configuration/entities/Tenant.entity";

@Entity("feature_flag")
@Index("idx_feature_flag_tenant_id", ["tenantId"])
@Index("idx_feature_flag_key_tenant_id", ["key", "tenantId"], { unique: true })
export class FeatureFlagEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar")
    key!: string;

    @Column("boolean", { default: false })
    value!: boolean;

    @ManyToOne(() => TenantEntity, (tenant) => tenant.featureFlags, {
        onDelete: "CASCADE",
    })
    tenant!: Relation<TenantEntity>;

    @Column({ type: "varchar" })
    tenantId!: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;
}
