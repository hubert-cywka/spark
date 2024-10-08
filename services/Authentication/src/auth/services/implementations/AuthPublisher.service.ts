import { IPublisherServiceToken, PublisherService, UserRegisteredEvent } from "@hcywka/pubsub";
import { Inject } from "@nestjs/common";

import { IAuthPublisherService } from "@/auth/services/interfaces/IAuthPublisher.service";
import { User } from "@/user/models/User.model";

export class AuthPublisherService implements IAuthPublisherService {
    public constructor(
        @Inject(IPublisherServiceToken)
        private publisher: PublisherService
    ) {}

    public onUserRegistered(user: { lastName: string; firstName: string } & User): void {
        this.publisher.publish(new UserRegisteredEvent({ user }));
    }
}
