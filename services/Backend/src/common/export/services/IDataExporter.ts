import { DataExportScope } from "@/common/export/models/DataExportScope";

export const DataExporterToken = Symbol("DataExportStartedEventHandler");

export interface IDataExporter {
    exportTenantData(tenantId: string, exportId: string, scopes: DataExportScope[]): Promise<void>;
}
