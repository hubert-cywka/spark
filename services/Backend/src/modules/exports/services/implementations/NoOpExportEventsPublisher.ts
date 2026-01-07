import { Injectable } from "@nestjs/common";

import type { IDataExportEventsPublisher } from "@/modules/exports/services/interfaces/IDataExportEventsPublisher";
import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";

@Injectable()
export class NoOpExportEventsPublisher implements IDataExportEventsPublisher {
    public async onExportStarted(tenantId: string, exportId: string, scopes: DataExportScope[]) {}
    public async onExportCancelled(tenantId: string, exportId: string) {}
    public async onExportCompleted(tenantId: string, exportId: string) {}
}
