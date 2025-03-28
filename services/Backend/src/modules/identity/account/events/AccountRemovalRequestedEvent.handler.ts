import { Inject, Injectable, Logger } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";
import { UnknownAccountProviderError } from "@/modules/identity/account/errors/UnknownAccountProvider.error";
import {
    type IFederatedAccountService,
    FederatedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IFederatedAccount.service";
import {
    type IManagedAccountService,
    ManagedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IManagedAccount.service";
import { FederatedAccountProvider, ManagedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

@Injectable()
export class AccountRemovalRequestedEventHandler implements IInboxEventHandler {
    private readonly logger = new Logger(AccountRemovalRequestedEventHandler.name);

    public constructor(
        @Inject(FederatedAccountServiceToken)
        private readonly federatedAccountService: IFederatedAccountService,
        @Inject(ManagedAccountServiceToken)
        private readonly managedAccountService: IManagedAccountService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.requested;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const { account } = event.getPayload() as AccountRemovalRequestedEventPayload;

        switch (account.providerId) {
            case FederatedAccountProvider.GOOGLE:
                return await this.federatedAccountService.suspendByInternalId(account.id);
            case ManagedAccountProvider.CREDENTIALS:
                return await this.managedAccountService.suspendByInternalId(account.id);
            default:
                this.logger.error(
                    {
                        accountProviderId: account.providerId,
                        accountId: account.id,
                    },
                    "Unknown account provider."
                );
                throw new UnknownAccountProviderError();
        }
    }
}
