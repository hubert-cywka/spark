import { DataExportScope } from "@/common/export/models/DataExportScope";
import { DataExportBatch } from "@/common/export/types/DataExportBatch";

export const DataExportProvidersToken = Symbol("DataExportProvidersToken");
export const DataExportProviderToken = Symbol("DataExportProviderToken");

export interface IDataExportProvider {
    supports(scope: DataExportScope): boolean;
    getDataStream(tenantId: string, scope: DataExportScope): AsyncIterable<DataExportBatch>;
}
