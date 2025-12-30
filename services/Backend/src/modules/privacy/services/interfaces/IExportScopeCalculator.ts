import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";

export const ExportScopeCalculatorToken = Symbol("ExportScopeCalculatorToken");

export interface IExportScopeCalculator {
    findMissingScopes(requiredScopes: DataExportScope[], manifests: ExportAttachmentManifest[]): DataExportScope[];
    mergeScopes(scopes: DataExportScope[]): DataExportScope[];
}
