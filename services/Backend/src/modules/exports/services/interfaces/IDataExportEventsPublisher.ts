import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";

export const DataExportEventsPublisherToken = Symbol("DataExportEventsPublisher");

export interface IDataExportEventsPublisher {
    onExportStarted(tenantId: string, exportId: string, scopes: DataExportScope[]): Promise<void>;
    onExportCancelled(tenantId: string, exportId: string): Promise<void>;
    onExportCompleted(tenantId: string, exportId: string): Promise<void>;
}
