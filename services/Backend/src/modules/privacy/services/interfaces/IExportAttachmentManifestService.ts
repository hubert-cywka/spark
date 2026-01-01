import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";

export const ExportAttachmentManifestServiceToken = Symbol("ExportAttachmentManifestServiceToken");

export interface IExportAttachmentManifestService {
    findTemporaryManifestsByExportId(exportId: string): Promise<ExportAttachmentManifest[]>;
    findFinalManifestByExportId(exportId: string): Promise<ExportAttachmentManifest | null>;

    storeAttachmentManifest(exportId: string, attachmentManifest: ExportAttachmentManifest): Promise<void>;
    deleteAttachmentManifests(attachmentManifests: ExportAttachmentManifest[]): Promise<void>;
}
