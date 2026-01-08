import { type Relation, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { DataExportEntity } from "@/modules/exports/entities/DataExport.entity";
import { ExportAttachmentManifestEntity } from "@/modules/exports/entities/ExportAttachmentManifest.entity";

@Entity("tenant")
export class TenantEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;

    @OneToMany(() => DataExportEntity, (dataExport) => dataExport.tenant)
    dataExports!: Relation<DataExportEntity[]>;

    @OneToMany(() => ExportAttachmentManifestEntity, (manifest) => manifest.tenant)
    exportAttachmentManifests!: Relation<ExportAttachmentManifestEntity[]>;
}
