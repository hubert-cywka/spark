import { type Relation, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { type DataExportScope } from "@/common/export/models/DataExportScope";
import { DataExportEntity } from "@/modules/privacy/entities/DataExport.entity";
import { TenantEntity } from "@/modules/privacy/entities/Tenant.entity";

@Entity("export_attachment_manifest")
export class ExportAttachmentManifestEntity {
    @PrimaryColumn({ type: "varchar" })
    key!: string;

    @Column({ type: "varchar" })
    path!: string;

    @Column({ type: "int" })
    part!: number;

    @Column({ type: "int", nullable: true })
    nextPart!: number | null;

    @Column({ type: "varchar" })
    checksum!: string;

    @Column({ type: "jsonb" })
    scope!: DataExportScope;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @ManyToOne(() => TenantEntity, (tenant) => tenant.dataPurgePlans, { onDelete: "CASCADE" })
    tenant!: Relation<TenantEntity>;

    @ManyToOne(() => DataExportEntity, (dataExport) => dataExport.attachmentManifests, { onDelete: "CASCADE" })
    dataExport!: Relation<DataExportEntity>;

    @Column({ type: "varchar" })
    dataExportId!: string;
}
