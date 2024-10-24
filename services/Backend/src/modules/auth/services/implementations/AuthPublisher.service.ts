import { Inject } from "@nestjs/common";

import { IPublisherServiceToken, PublisherService, UserRegisteredEvent } from "@/common/pubsub";
import { User } from "@/modules/auth/models/User.model";
import { IAuthPublisherService } from "@/modules/auth/services/interfaces/IAuthPublisher.service";

export class AuthPublisherService implements IAuthPublisherService {
    public constructor(
        @Inject(IPublisherServiceToken)
        private publisher: PublisherService
    ) {}

    public onUserRegistered(user: { lastName: string; firstName: string } & User): void {
        this.publisher.publish(new UserRegisteredEvent({ user }));
    }
}
