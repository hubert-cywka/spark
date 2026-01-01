import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentKind } from "@/modules/privacy/entities/ExportAttachmentManifest.entity";

export type ExportAttachmentManifest = {
    key: string;
    path: string;
    scopes: DataExportScope[];
    kind: ExportAttachmentKind;
    metadata: {
        checksum: string;
        part: number;
        nextPart: number | null;
    };
};
