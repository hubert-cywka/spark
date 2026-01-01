import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentStage } from "@/common/export/types/ExportAttachmentStage";

export type ExportAttachmentManifest = {
    key: string;
    path: string;
    scopes: DataExportScope[];
    stage: ExportAttachmentStage;
    metadata: {
        checksum: string;
        part: number;
        nextPart: number | null;
    };
};
