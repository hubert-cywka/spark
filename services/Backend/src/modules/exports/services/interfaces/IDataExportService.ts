import { DataExportScope } from "@/common/export/models/DataExportScope";
import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { DataExport } from "@/modules/exports/models/DataExport.model";

export const DataExportServiceToken = Symbol("DataExportService");

export interface IDataExportService {
    getActiveById(tenantId: string, exportId: string): Promise<DataExport>;
    getCompletedById(tenantId: string, exportId: string): Promise<DataExport>;

    findAllValid(tenantId: string, pageOptions: PageOptions): Promise<Paginated<DataExport>>;
    deleteExpired(): Promise<void>;

    createExportEntry(tenantId: string, scopes: DataExportScope[]): Promise<DataExport>;
    markExportAsCancelled(tenantId: string, exportId: string): Promise<void>;
    markExportAsCompleted(tenantId: string, exportId: string): Promise<void>;
}
