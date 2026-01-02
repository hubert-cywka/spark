import { type Relation, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { TenantEntity } from "@/modules/privacy/entities/Tenant.entity";

@Entity("data_purge_plan")
@Index("idx_data_purge_processing", ["removeAt"], { where: '"cancelledAt" IS NULL AND "processedAt" IS NULL' })
@Index("idx_data_purge_tenant_active", ["tenantId"], { where: '"cancelledAt" IS NULL AND "processedAt" IS NULL' })
export class DataPurgePlanEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "timestamptz" })
    scheduledAt!: Date;

    @Column({ type: "timestamptz" })
    removeAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    cancelledAt!: Date | null;

    @Column({ type: "timestamptz", nullable: true })
    processedAt!: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @ManyToOne(() => TenantEntity, (tenant) => tenant.dataPurgePlans, {
        onDelete: "CASCADE",
    })
    tenant!: Relation<TenantEntity>;

    @Column({ type: "varchar" })
    tenantId!: string;
}
