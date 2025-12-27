import { Inject, Injectable } from "@nestjs/common";

import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { whenError } from "@/common/errors/whenError";
import { DataExportBatchReadyEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { type IExportOrchestrator, ExportOrchestratorToken } from "@/modules/privacy/services/interfaces/IExportOrchestrator";

@Injectable()
export class DataExportBatchReadyEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(ExportOrchestratorToken)
        private readonly orchestrator: IExportOrchestrator
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.export.batch.ready.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as DataExportBatchReadyEventPayload;

        try {
            await this.orchestrator.checkpoint(payload.tenant.id, payload.export.id, payload.attachment);
        } catch (error) {
            // When export is already completed/canceled, ignore the exception. The event couldn't be processed anyway.
            // There will be an additional mechanism to ensure correctness.
            whenError(error).is(EntityConflictError).ignore().elseRethrow();
        }
    }
}
