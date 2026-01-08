import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";
import { ExportAttachmentStage } from "@/modules/exports/shared/types/ExportAttachmentStage";

export type ExportAttachmentManifest = {
    key: string;
    path: string;
    scopes: DataExportScope[];
    stage: ExportAttachmentStage;
    metadata: {
        checksum: string;
    };
};
