import { Inject, Injectable } from "@nestjs/common";

import { IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { type IDataExportService, DataExportServiceToken } from "@/modules/exports/services/interfaces/IDataExportService";

@Injectable()
export class DataExportCleanupTriggeredEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(DataExportServiceToken)
        private readonly service: IDataExportService
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.export.cleanup.triggered.subject;
    }

    public async handle(_: IntegrationEvent): Promise<void> {
        await this.service.deleteExpired();
    }
}
