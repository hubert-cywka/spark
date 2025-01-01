import { Inject } from "@nestjs/common";

import {
    AccountActivatedEvent,
    AccountActivationTokenRequestedEvent,
    AccountPasswordUpdatedEvent,
    AccountRequestedPasswordResetEvent,
} from "@/common/events";
import { type IEventOutbox, EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { type IAccountPublisherService } from "@/modules/identity/account/services/interfaces/IAccountPublisher.service";

export class AccountPublisherService implements IAccountPublisherService {
    public constructor(
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public async onAccountActivated(email: string, id: string) {
        await this.outbox.enqueue(new AccountActivatedEvent({ email, id }));
    }

    public async onAccountActivationTokenRequested(email: string, activationToken: string) {
        await this.outbox.enqueue(
            new AccountActivationTokenRequestedEvent({
                email,
                activationToken,
            })
        );
    }

    public async onPasswordResetRequested(email: string, passwordResetToken: string) {
        await this.outbox.enqueue(
            new AccountRequestedPasswordResetEvent({
                email,
                passwordResetToken,
            })
        );
    }

    public async onPasswordUpdated(email: string, id: string) {
        await this.outbox.enqueue(
            new AccountPasswordUpdatedEvent({
                email,
                id,
            })
        );
    }
}
