import { DataExportScope } from "@/common/export/models/DataExportScope";

export type ExportAttachmentManifest = {
    key: string;
    path: string;
    scope: DataExportScope;
    metadata: {
        checksum: string;
        part: number;
        nextPart: number | null;
    };
};
