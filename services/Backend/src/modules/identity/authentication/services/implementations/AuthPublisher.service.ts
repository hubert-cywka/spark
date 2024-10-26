import { Inject } from "@nestjs/common";

import { AccountRegisteredEvent, IPublisherServiceToken, PublisherService } from "@/common/events";
import { Account } from "@/modules/identity/account/models/Account.model";
import { IAuthPublisherService } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";

export class AuthPublisherService implements IAuthPublisherService {
    public constructor(
        @Inject(IPublisherServiceToken)
        private publisher: PublisherService
    ) {}

    public onAccountRegistered(account: { lastName: string; firstName: string } & Account): void {
        this.publisher.publish(new AccountRegisteredEvent({ account }));
    }
}
