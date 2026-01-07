import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";

export const ExportOrchestratorToken = Symbol("ExportOrchestrator");

export interface IExportOrchestrator {
    start(tenantId: string, scopes: DataExportScope[]): Promise<void>;
    checkpoint(tenantId: string, exportId: string, attachmentManifest: ExportAttachmentManifest): Promise<void>;
    cancel(tenantId: string, exportId: string): Promise<void>;
}
