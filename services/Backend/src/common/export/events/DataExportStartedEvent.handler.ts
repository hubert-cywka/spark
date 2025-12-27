import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, DataExportStartedEventPayload, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { type IDataExporter, DataExporterToken } from "@/common/export/services/IDataExporter";

@Injectable()
export class DataExportStartedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(DataExporterToken)
        private readonly exporter: IDataExporter
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.export.started.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as DataExportStartedEventPayload;
        await this.exporter.exportTenantData(payload.tenant.id, payload.export.id, payload.export.scopes);
    }
}
