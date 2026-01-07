import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { DataExportCompletedEventPayload } from "@/common/events/types/export/DataExportCompletedEvent";
import { ExportAttachmentStage } from "@/common/export/types/ExportAttachmentStage";
import { type IExportOrchestrator, ExportOrchestratorToken } from "@/modules/exports/services/interfaces/IExportOrchestrator";

@Injectable()
export class DataExportCompletedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(ExportOrchestratorToken)
        private readonly orchestrator: IExportOrchestrator
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.export.completed.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as DataExportCompletedEventPayload;
        await this.orchestrator.cleanup(payload.tenant.id, payload.export.id, ExportAttachmentStage.TEMPORARY);
    }
}
