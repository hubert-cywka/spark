import { Inject, Injectable, Logger } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";
import {
    type IAccountRemovalService,
    AccountRemovalServiceToken,
} from "@/modules/identity/account/services/interfaces/IAccountRemoval.service";

@Injectable()
export class AccountRemovalRequestedEventHandler implements IInboxEventHandler {
    private readonly logger = new Logger(AccountRemovalRequestedEventHandler.name);

    public constructor(
        @Inject(AccountRemovalServiceToken)
        private readonly removalService: IAccountRemovalService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.requested;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const { account } = (await event.getPayload()) as AccountRemovalRequestedEventPayload;
        return await this.removalService.suspendByInternalId(account.id);
    }
}
