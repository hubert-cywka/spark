import { Inject, Injectable } from "@nestjs/common";

import { AccountRegisteredEvent, IPublisherServiceToken, PublisherService } from "@/common/events";
import type { Account } from "@/modules/identity/account/models/Account.model";
import { type IAuthPublisherService } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";

@Injectable()
export class AuthPublisherService implements IAuthPublisherService {
    public constructor(
        @Inject(IPublisherServiceToken)
        private publisher: PublisherService
    ) {}

    public onAccountRegistered(account: { lastName: string; firstName: string } & Account): void {
        this.publisher.publish(new AccountRegisteredEvent({ account }));
    }
}
