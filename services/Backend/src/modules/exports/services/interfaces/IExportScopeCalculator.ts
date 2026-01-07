import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";
import { ExportAttachmentManifest } from "@/modules/exports/shared/models/ExportAttachment.model";

export const ExportScopeCalculatorToken = Symbol("ExportScopeCalculatorToken");

export interface IExportScopeCalculator {
    findMissingScopes(requiredScopes: DataExportScope[], manifests: ExportAttachmentManifest[]): DataExportScope[];
    trimScopesAfter(scopes: DataExportScope[], cutoffDate: Date): DataExportScope[];
    mergeScopes(scopes: DataExportScope[]): DataExportScope[];
}
