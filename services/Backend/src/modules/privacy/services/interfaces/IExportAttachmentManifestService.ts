import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";

export const ExportAttachmentManifestServiceToken = Symbol("ExportAttachmentManifestServiceToken");

export interface IExportAttachmentManifestService {
    getAllManifestsByExportId(exportId: string): Promise<ExportAttachmentManifest[]>;
    storeAttachmentManifest(exportId: string, attachmentManifest: ExportAttachmentManifest): Promise<void>;
}
