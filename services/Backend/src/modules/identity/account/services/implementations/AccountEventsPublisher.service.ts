import { Inject } from "@nestjs/common";

import {
    AccountActivatedEvent,
    AccountActivationTokenRequestedEvent,
    AccountCreatedEvent,
    AccountPasswordUpdatedEvent,
    AccountRequestedPasswordResetEvent,
} from "@/common/events";
import { type IEventPublisher, EventPublisherToken } from "@/common/events/services/interfaces/IEventPublisher";
import { AccountSuspendedEvent } from "@/common/events/types/account/AccountSuspendedEvent";
import { type IAccountEventsPublisher } from "@/modules/identity/account/services/interfaces/IAccountEventsPublisher.service";

export class AccountEventsPublisher implements IAccountEventsPublisher {
    public constructor(
        @Inject(EventPublisherToken)
        private readonly publisher: IEventPublisher
    ) {}

    public async onAccountCreated(tenantId: string, email: string): Promise<void> {
        await this.publisher.enqueue(
            new AccountCreatedEvent(tenantId, {
                account: { id: tenantId, email },
            })
        );
    }

    public async onAccountActivated(tenantId: string, email: string) {
        await this.publisher.enqueue(
            new AccountActivatedEvent(tenantId, {
                account: { id: tenantId, email },
            })
        );
    }

    public async onAccountActivationTokenRequested(tenantId: string, email: string, accountActivationRedirectUrl: string) {
        await this.publisher.enqueue(
            new AccountActivationTokenRequestedEvent(tenantId, {
                account: { id: tenantId, email },
                redirectUrl: accountActivationRedirectUrl,
            }),
            { encrypt: true }
        );
    }

    public async onPasswordResetRequested(tenantId: string, passwordResetRedirectUrl: string) {
        await this.publisher.enqueue(
            new AccountRequestedPasswordResetEvent(tenantId, {
                account: { id: tenantId },
                redirectUrl: passwordResetRedirectUrl,
            }),
            { encrypt: true }
        );
    }

    public async onPasswordUpdated(tenantId: string) {
        await this.publisher.enqueue(
            new AccountPasswordUpdatedEvent(tenantId, {
                account: {
                    id: tenantId,
                },
            })
        );
    }

    public async onAccountSuspended(tenantId: string) {
        await this.publisher.enqueue(
            new AccountSuspendedEvent(tenantId, {
                account: {
                    id: tenantId,
                },
            })
        );
    }
}
