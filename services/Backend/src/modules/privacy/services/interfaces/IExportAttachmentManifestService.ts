import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";

export const ExportAttachmentManifestServiceToken = Symbol("ExportAttachmentManifestServiceToken");

export interface IExportAttachmentManifestService {
    getTemporaryManifestsByExportId(exportId: string): Promise<ExportAttachmentManifest[]>;
    getFinalManifestByExportId(exportId: string): Promise<ExportAttachmentManifest | null>;

    storeAttachmentManifest(exportId: string, attachmentManifest: ExportAttachmentManifest): Promise<void>;
    deleteAttachmentManifests(attachmentManifests: ExportAttachmentManifest[]): Promise<void>;
}
