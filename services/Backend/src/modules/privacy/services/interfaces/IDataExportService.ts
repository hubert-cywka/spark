import { DataExportScope } from "@/common/export/models/DataExportScope";
import { DataExport } from "@/modules/privacy/models/DataExport.model";

export const DataExportServiceToken = Symbol("DataExportService");

export interface IDataExportService {
    getActiveById(tenantId: string, exportId: string): Promise<DataExport>;
    getAll(tenantId: string): Promise<DataExport[]>;

    createExportEntry(tenantId: string, scopes: DataExportScope[]): Promise<DataExport>;
    markExportAsCancelled(tenantId: string, exportId: string): Promise<void>;
    markExportAsCompleted(tenantId: string, exportId: string): Promise<void>;
}
