import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";

export const ExportAttachmentManifestServiceToken = Symbol("ExportAttachmentManifestServiceToken");

export interface IExportAttachmentManifestService {
    findTemporaryManifestsByExportId(tenantId: string, exportId: string): Promise<ExportAttachmentManifest[]>;
    getFinalManifestByExportId(tenantId: string, exportId: string): Promise<ExportAttachmentManifest>;

    storeAttachmentManifest(exportId: string, attachmentManifest: ExportAttachmentManifest): Promise<void>;
    deleteAttachmentManifests(attachmentManifests: ExportAttachmentManifest[]): Promise<void>;
}
