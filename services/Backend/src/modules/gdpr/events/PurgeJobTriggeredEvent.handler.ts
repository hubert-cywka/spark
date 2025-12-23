import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { type IDataPurgeProcessor, DataPurgeProcessorToken } from "@/modules/gdpr/services/interfaces/IDataPurgeProcessor";

@Injectable()
export class PurgeJobTriggeredEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(DataPurgeProcessorToken)
        private readonly purgeProcessor: IDataPurgeProcessor
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.gdpr.purge.triggered.subject;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        await this.purgeProcessor.processDataPurgePlans();
    }
}
