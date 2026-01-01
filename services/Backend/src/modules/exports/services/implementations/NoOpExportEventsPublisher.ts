import { Injectable } from "@nestjs/common";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import type { IDataExportEventsPublisher } from "@/modules/exports/services/interfaces/IDataExportEventsPublisher";

@Injectable()
export class NoOpExportEventsPublisher implements IDataExportEventsPublisher {
    public async onExportStarted(tenantId: string, exportId: string, scopes: DataExportScope[]) {}
    public async onExportCancelled(tenantId: string, exportId: string) {}
    public async onExportCompleted(tenantId: string, exportId: string) {}
}
