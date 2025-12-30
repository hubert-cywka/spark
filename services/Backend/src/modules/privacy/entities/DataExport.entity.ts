import { type Relation, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifestEntity } from "@/modules/privacy/entities/ExportAttachmentManifest.entity";
import { TenantEntity } from "@/modules/privacy/entities/Tenant.entity";

@Entity("data_export")
export class DataExportEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "jsonb" })
    targetScopes!: DataExportScope[];

    @Column({ type: "timestamptz", nullable: true })
    cancelledAt!: Date | null;

    @Column({ type: "timestamptz", nullable: true })
    completedAt!: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    startedAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @ManyToOne(() => TenantEntity, (tenant) => tenant.dataExports, { onDelete: "CASCADE" })
    tenant!: Relation<TenantEntity>;

    @Column({ type: "varchar" })
    tenantId!: string;

    @OneToMany(() => ExportAttachmentManifestEntity, (attachment) => attachment.tenant, { onDelete: "CASCADE" })
    attachmentManifests!: Relation<ExportAttachmentManifestEntity[]>;
}
