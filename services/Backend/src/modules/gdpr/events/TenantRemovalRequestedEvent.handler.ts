import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";
import { type IDataPurgeScheduler, DataPurgeSchedulerToken } from "@/modules/gdpr/services/interfaces/IDataPurgeScheduler.service";

@Injectable()
export class TenantRemovalRequestedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(DataPurgeSchedulerToken)
        private readonly dataPurgeService: IDataPurgeScheduler
    ) {}

    public canHandle(subject: string): boolean {
        return subject === IntegrationEvents.account.removal.requested.subject;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalRequestedEventPayload;
        await this.dataPurgeService.scheduleForTenant(payload.account.id);
    }
}
