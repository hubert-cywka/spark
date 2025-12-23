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
import {
    type IAccountRemovalService,
    AccountRemovalServiceToken,
} from "@/modules/identity/account/services/interfaces/IAccountRemovalService";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class AccountRemovedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(AccountRemovalServiceToken)
        private readonly removalService: IAccountRemovalService,
        @Inject(InboxEventsRemovalServiceToken)
        private readonly inboxRemovalService: IEventsRemovalService,
        @Inject(OutboxEventsRemovalServiceToken)
        private readonly outboxRemovalService: IEventsRemovalService
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.account.removal.completed.subject;
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalCompletedEventPayload;
        await this.outboxRemovalService.removeByTenant(payload.account.id);
        await this.inboxRemovalService.removeByTenant(payload.account.id);
        await this.removalService.removeByInternalId(payload.account.id);
    }
}
