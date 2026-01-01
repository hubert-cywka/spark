import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { ISODateString } from "@/types/Date";

export const ExportScopeCalculatorToken = Symbol("ExportScopeCalculatorToken");

export interface IExportScopeCalculator {
    findMissingScopes(requiredScopes: DataExportScope[], manifests: ExportAttachmentManifest[]): DataExportScope[];
    trimScopesAfter(scopes: DataExportScope[], cutoffDate: ISODateString): DataExportScope[];
    mergeScopes(scopes: DataExportScope[]): DataExportScope[];
}
