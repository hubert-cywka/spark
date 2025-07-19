import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";
import { type IDataPurgeScheduler, DataPurgeSchedulerToken } from "@/modules/gdpr/services/interfaces/IDataPurgeScheduler.service";

@Injectable()
export class TenantRemovalRequestedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(DataPurgeSchedulerToken)
        private readonly dataPurgeService: IDataPurgeScheduler
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.requested;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalRequestedEventPayload;
        await this.dataPurgeService.scheduleForTenant(payload.account.id);
    }
}
