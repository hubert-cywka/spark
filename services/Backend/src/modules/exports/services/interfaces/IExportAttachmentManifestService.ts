import { ExportAttachmentManifest } from "@/modules/exports/shared/models/ExportAttachment.model";
import { ExportAttachmentStage } from "@/modules/exports/shared/types/ExportAttachmentStage";

export const ExportAttachmentManifestServiceToken = Symbol("ExportAttachmentManifestServiceToken");

export interface IExportAttachmentManifestService {
    findManifestsByExportId(tenantId: string, exportId: string, stage?: ExportAttachmentStage): Promise<ExportAttachmentManifest[]>;
    getFinalManifestByExportId(tenantId: string, exportId: string): Promise<ExportAttachmentManifest>;

    storeAttachmentManifest(tenantId: string, exportId: string, attachmentManifest: ExportAttachmentManifest): Promise<void>;
    deleteAttachmentManifests(attachmentManifests: ExportAttachmentManifest[]): Promise<void>;
}
