import { Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import {
    type IEventsRemovalService,
    InboxEventsRemovalServiceToken,
    OutboxEventsRemovalServiceToken,
} from "@/common/events/services/interfaces/IEventsRemovalService";
import { IntegrationEventSubject } from "@/common/events/types";
import { type AccountRemovalCompletedEventPayload } from "@/common/events/types/account/AccountRemovalCompletedEvent";
import { EXPORTS_MODULE_DATA_SOURCE } from "@/modules/exports/infrastructure/database/constants";
import { type ITenantService, TenantServiceToken } from "@/modules/exports/services/interfaces/ITenantService";

@Injectable()
export class TenantRemovedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(TenantServiceToken)
        private readonly tenantService: ITenantService,
        @Inject(InboxEventsRemovalServiceToken)
        private readonly inboxRemovalService: IEventsRemovalService,
        @Inject(OutboxEventsRemovalServiceToken)
        private readonly outboxRemovalService: IEventsRemovalService
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.account.removal.completed.subject;
    }

    @Transactional({ connectionName: EXPORTS_MODULE_DATA_SOURCE })
    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalCompletedEventPayload;
        await this.inboxRemovalService.removeByTenant(payload.account.id);
        await this.outboxRemovalService.removeByTenant(payload.account.id);
        await this.tenantService.remove(payload.account.id);
    }
}
