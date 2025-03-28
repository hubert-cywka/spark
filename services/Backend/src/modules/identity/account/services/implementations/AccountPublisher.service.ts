import { Inject } from "@nestjs/common";

import {
    AccountActivatedEvent,
    AccountActivationTokenRequestedEvent,
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

    public async onAccountActivated(email: string, tenantId: string) {
        await this.outbox.enqueue(new AccountActivatedEvent(tenantId, { email, id: tenantId }));
    }

    public async onAccountActivationTokenRequested(tenantId: string, email: string, activationToken: string) {
        await this.outbox.enqueue(
            new AccountActivationTokenRequestedEvent(tenantId, {
                email,
                activationToken,
            })
        );
    }

    public async onPasswordResetRequested(tenantId: string, email: string, passwordResetToken: string) {
        await this.outbox.enqueue(
            new AccountRequestedPasswordResetEvent(tenantId, {
                email,
                passwordResetToken,
            })
        );
    }

    public async onPasswordUpdated(email: string, tenantId: string) {
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
