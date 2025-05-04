import { Inject } from "@nestjs/common";

import {
    AccountActivatedEvent,
    AccountActivationTokenRequestedEvent,
    AccountCreatedEvent,
    AccountPasswordUpdatedEvent,
    AccountRequestedPasswordResetEvent,
} from "@/common/events";
import { type IEventOutbox, EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { AccountSuspendedEvent } from "@/common/events/types/account/AccountSuspendedEvent";
import { type IAccountPublisherService } from "@/modules/identity/account/services/interfaces/IAccountPublisher.service";

export class AccountPublisherService implements IAccountPublisherService {
    public constructor(
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public async onAccountCreated(tenantId: string, email: string): Promise<void> {
        await this.outbox.enqueue(new AccountCreatedEvent(tenantId, { id: tenantId, email }));
    }

    public async onAccountActivated(tenantId: string, email: string) {
        await this.outbox.enqueue(new AccountActivatedEvent(tenantId, { email, id: tenantId }));
    }

    public async onAccountActivationTokenRequested(tenantId: string, email: string, accountActivationRedirectUrl: string) {
        await this.outbox.enqueue(
            new AccountActivationTokenRequestedEvent(tenantId, {
                email,
                redirectUrl: accountActivationRedirectUrl,
            }),
            { encrypt: true }
        );
    }

    public async onPasswordResetRequested(tenantId: string, email: string, passwordResetRedirectUrl: string) {
        await this.outbox.enqueue(
            new AccountRequestedPasswordResetEvent(tenantId, {
                email,
                redirectUrl: passwordResetRedirectUrl,
            }),
            { encrypt: true }
        );
    }

    public async onPasswordUpdated(tenantId: string, email: string) {
        await this.outbox.enqueue(
            new AccountPasswordUpdatedEvent(tenantId, {
                email,
                id: tenantId,
            })
        );
    }

    public async onAccountSuspended(tenantId: string) {
        await this.outbox.enqueue(
            new AccountSuspendedEvent(tenantId, {
                id: tenantId,
            })
        );
    }
}
