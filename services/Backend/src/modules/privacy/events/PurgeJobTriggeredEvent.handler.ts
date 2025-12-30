import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { JobTriggeredEvent } from "@/common/events/types/scheduling/JobTriggeredEvent";
import { type IDataPurgeProcessor, DataPurgeProcessorToken } from "@/modules/privacy/services/interfaces/IDataPurgeProcessor";

@Injectable()
export class PurgeJobTriggeredEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(DataPurgeProcessorToken)
        private readonly purgeProcessor: IDataPurgeProcessor
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.purge.triggered.subject;
    }

    public async handle(event: JobTriggeredEvent): Promise<void> {
        await this.purgeProcessor.processDataPurgePlans();
    }
}
