import { type Relation, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { type DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentStage } from "@/common/export/types/ExportAttachmentStage";
import { DataExportEntity } from "@/modules/exports/entities/DataExport.entity";
import { TenantEntity } from "@/modules/exports/entities/Tenant.entity";

@Entity("export_attachment_manifest")
@Index("idx_manifest_lookup", ["tenantId", "dataExportId", "stage"])
@Index("idx_manifest_export", ["dataExportId"])
export class ExportAttachmentManifestEntity {
    @PrimaryColumn({ type: "varchar" })
    key!: string;

    @Column({ type: "varchar" })
    path!: string;

    @Column({ type: "enum", enum: ExportAttachmentStage })
    stage!: ExportAttachmentStage;

    @Column({ type: "varchar" })
    checksum!: string;

    @Column({ type: "jsonb" })
    scopes!: DataExportScope[];

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @ManyToOne(() => TenantEntity, (tenant) => tenant.exportAttachmentManifests, { onDelete: "CASCADE" })
    tenant!: Relation<TenantEntity>;

    @Column({ type: "varchar" })
    tenantId!: string;

    @ManyToOne(() => DataExportEntity, (dataExport) => dataExport.attachmentManifests, { onDelete: "CASCADE" })
    dataExport!: Relation<DataExportEntity>;

    @Column({ type: "varchar" })
    dataExportId!: string;
}
