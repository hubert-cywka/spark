import {
    type Relation,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { ExportAttachmentManifestEntity } from "@/modules/exports/entities/ExportAttachmentManifest.entity";
import { TenantEntity } from "@/modules/exports/entities/Tenant.entity";
import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";

@Entity("data_export")
@Index("idx_data_export", ["tenantId", "validUntil"])
export class DataExportEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "jsonb" })
    targetScopes!: DataExportScope[];

    @Column({ type: "timestamptz", precision: 3, nullable: true })
    cancelledAt!: Date | null;

    @Column({ type: "timestamptz", precision: 3, nullable: true })
    completedAt!: Date | null;

    @Column({ type: "timestamptz", precision: 3 })
    validUntil!: Date;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    startedAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;

    @ManyToOne(() => TenantEntity, (tenant) => tenant.dataExports, { onDelete: "CASCADE" })
    tenant!: Relation<TenantEntity>;

    @Column({ type: "varchar" })
    tenantId!: string;

    @OneToMany(() => ExportAttachmentManifestEntity, (attachment) => attachment.tenant, { onDelete: "CASCADE" })
    attachmentManifests!: Relation<ExportAttachmentManifestEntity[]>;
}
