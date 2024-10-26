import { Inject } from "@nestjs/common";

import {
    AccountActivatedEvent,
    AccountActivationTokenRequestedEvent,
    AccountRequestedPasswordResetEvent,
    IPublisherServiceToken,
    PublisherService,
} from "@/common/events";
import { Account } from "@/modules/identity/account/models/Account.model";
import { IAccountPublisherService } from "@/modules/identity/account/services/interfaces/IAccountPublisherService";

export class AccountPublisherService implements IAccountPublisherService {
    public constructor(
        @Inject(IPublisherServiceToken)
        private publisher: PublisherService
    ) {}

    public onAccountActivated(account: Account): void {
        this.publisher.publish(new AccountActivatedEvent({ account }));
    }

    public onAccountActivationTokenRequested(email: string, activationToken: string) {
        this.publisher.publish(
            new AccountActivationTokenRequestedEvent({
                email,
                activationToken,
            })
        );
    }

    public onPasswordResetRequested(email: string, passwordResetToken: string) {
        this.publisher.publish(
            new AccountRequestedPasswordResetEvent({
                email,
                passwordResetToken,
            })
        );
    }
}
