import { type Relation, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { TenantEntity } from "@/modules/gdpr/entities/Tenant.entity";

@Entity("data_purge_plan")
export class DataPurgePlanEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "timestamptz" })
    scheduledAt!: Date;

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
