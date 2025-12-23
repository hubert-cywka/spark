import { Inject, Injectable, Logger } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";
import {
    type IAccountRemovalService,
    AccountRemovalServiceToken,
} from "@/modules/identity/account/services/interfaces/IAccountRemovalService";

@Injectable()
export class AccountRemovalRequestedEventHandler implements IInboxEventHandler {
    private readonly logger = new Logger(AccountRemovalRequestedEventHandler.name);

    public constructor(
        @Inject(AccountRemovalServiceToken)
        private readonly removalService: IAccountRemovalService
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.account.removal.requested.subject;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const { account } = event.getPayload() as AccountRemovalRequestedEventPayload;
        return await this.removalService.suspendByInternalId(account.id);
    }
}
