import { type Relation, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { DataExportEntity } from "@/modules/privacy/entities/DataExport.entity";
import { DataPurgePlanEntity } from "@/modules/privacy/entities/DataPurgePlan.entity";
import { ExportAttachmentManifestEntity } from "@/modules/privacy/entities/ExportAttachmentManifest.entity";

@Entity("tenant")
export class TenantEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @OneToMany(() => DataPurgePlanEntity, (plan) => plan.tenant)
    dataPurgePlans!: Relation<DataPurgePlanEntity[]>;

    @OneToMany(() => DataExportEntity, (dataExport) => dataExport.tenant)
    dataExports!: Relation<DataExportEntity[]>;

    @OneToMany(() => ExportAttachmentManifestEntity, (manifest) => manifest.tenant)
    exportAttachmentManifests!: Relation<ExportAttachmentManifestEntity[]>;
}
