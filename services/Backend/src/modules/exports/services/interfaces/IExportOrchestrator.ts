import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";
import { ExportAttachmentManifest } from "@/modules/exports/shared/models/ExportAttachment.model";

export const ExportOrchestratorToken = Symbol("ExportOrchestrator");

export interface IExportOrchestrator {
    start(tenantId: string, scopes: DataExportScope[]): Promise<void>;
    checkpoint(tenantId: string, exportId: string, attachmentManifest: ExportAttachmentManifest): Promise<void>;
    cancel(tenantId: string, exportId: string): Promise<void>;
}
