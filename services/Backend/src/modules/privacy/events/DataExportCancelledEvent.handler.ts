import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, DataExportCancelledEventPayload, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { type IExportOrchestrator, ExportOrchestratorToken } from "@/modules/privacy/services/interfaces/IExportOrchestrator";

@Injectable()
export class DataExportCancelledEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(ExportOrchestratorToken)
        private readonly orchestrator: IExportOrchestrator
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.export.cancelled.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as DataExportCancelledEventPayload;
        await this.orchestrator.cleanup(payload.tenant.id, payload.export.id);
    }
}
