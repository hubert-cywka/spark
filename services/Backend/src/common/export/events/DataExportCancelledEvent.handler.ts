import { Inject, Injectable } from "@nestjs/common";

import { DataExportCancelledEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { type IDataExporter, DataExporterToken } from "@/common/export/services/IDataExporter";

@Injectable()
export class DataExportCancelledEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(DataExporterToken)
        private readonly exporter: IDataExporter
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.export.cancelled.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as DataExportCancelledEventPayload;
        // TODO: Implement
    }
}
