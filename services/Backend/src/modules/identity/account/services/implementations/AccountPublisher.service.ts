import { Inject } from "@nestjs/common";

import {
    AccountActivatedEvent,
    AccountActivationTokenRequestedEvent,
    AccountPasswordUpdatedEvent,
    AccountRequestedPasswordResetEvent,
    IPublisherServiceToken,
    PublisherService,
} from "@/common/events";
import { IAccountPublisherService } from "@/modules/identity/account/services/interfaces/IAccountPublisher.service";

export class AccountPublisherService implements IAccountPublisherService {
    public constructor(
        @Inject(IPublisherServiceToken)
        private publisher: PublisherService
    ) {}

    public onAccountActivated(email: string, id: string): void {
        this.publisher.publish(new AccountActivatedEvent({ email, id }));
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

    public onPasswordUpdated(email: string, id: string) {
        this.publisher.publish(
            new AccountPasswordUpdatedEvent({
                email,
                id,
            })
        );
    }
}
