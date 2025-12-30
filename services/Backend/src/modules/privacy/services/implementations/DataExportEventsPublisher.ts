import { Inject, Injectable } from "@nestjs/common";

import { DataExportCancelledEvent, DataExportStartedEvent } from "@/common/events";
import { type IEventPublisher, EventPublisherToken } from "@/common/events/services/interfaces/IEventPublisher";
import { DataExportCompletedEvent } from "@/common/events/types/export/DataExportCompletedEvent";
import { DataExportScope } from "@/common/export/models/DataExportScope";
import { type IDataExportEventsPublisher } from "@/modules/privacy/services/interfaces/IDataExportEventsPublisher";

@Injectable()
export class DataExportEventsPublisher implements IDataExportEventsPublisher {
    public constructor(
        @Inject(EventPublisherToken)
        private readonly publisher: IEventPublisher
    ) {}

    public async onExportStarted(tenantId: string, exportId: string, scopes: DataExportScope[]) {
        await this.publisher.enqueue(
            new DataExportStartedEvent(tenantId, {
                tenant: {
                    id: tenantId,
                },
                export: {
                    id: exportId,
                    scopes,
                },
            })
        );
    }

    public async onExportCancelled(tenantId: string, exportId: string) {
        await this.publisher.enqueue(
            new DataExportCancelledEvent(tenantId, {
                tenant: {
                    id: tenantId,
                },
                export: {
                    id: exportId,
                },
            })
        );
    }

    public async onExportCompleted(tenantId: string, exportId: string) {
        await this.publisher.enqueue(
            new DataExportCompletedEvent(tenantId, {
                tenant: {
                    id: tenantId,
                },
                export: {
                    id: exportId,
                },
            })
        );
    }
}
