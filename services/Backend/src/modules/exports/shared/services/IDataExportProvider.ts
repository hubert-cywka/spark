import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";
import { ExportStatus } from "@/modules/exports/shared/models/ExportStatus";
import { DataExportBatch } from "@/modules/exports/shared/types/DataExportBatch";

export const DataExportProvidersToken = Symbol("DataExportProvidersToken");
export const DataExportProviderToken = Symbol("DataExportProviderToken");

export interface IDataExportProvider {
    supports(scope: DataExportScope): boolean;
    getDataStream(tenantId: string, scope: DataExportScope, status?: ExportStatus | null): AsyncIterable<DataExportBatch>;
}
