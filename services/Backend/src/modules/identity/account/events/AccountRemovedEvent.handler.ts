import { Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import {
    type IEventsRemovalService,
    InboxEventsRemovalServiceToken,
    OutboxEventsRemovalServiceToken,
} from "@/common/events/services/interfaces/IEventsRemoval.service";
import { type AccountRemovalCompletedEventPayload } from "@/common/events/types/account/AccountRemovalCompletedEvent";
import {
    type IAccountRemovalService,
    AccountRemovalServiceToken,
} from "@/modules/identity/account/services/interfaces/IAccountRemoval.service";
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

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.completed;
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalCompletedEventPayload;
        await this.outboxRemovalService.removeByTenant(payload.account.id);
        await this.inboxRemovalService.removeByTenant(payload.account.id);
        await this.removalService.removeByInternalId(payload.account.id);
    }
}
