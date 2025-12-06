import {
    type Relation,
    Column,
    CreateDateColumn,
    Entity,
Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn} from "typeorm";

import {TenantEntity} from "@/modules/configuration/entities/Tenant.entity";


@Entity("feature_flag")
@Unique(["key", "tenantId"])
@Index("IDX_FEATURE_FLAG_KEY", ["key"])
@Index("IDX_FEATURE_FLAG_TENANT_ID", ["tenantId"])
@Index("IDX_FEATURE_FLAG_KEY_TENANT_ID", ["key", "tenantId"])
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
