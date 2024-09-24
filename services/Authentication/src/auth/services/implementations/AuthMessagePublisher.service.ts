import { Inject } from "@nestjs/common";
import { Observable } from "rxjs";

import { IAuthMessagePublisherService } from "@/auth/services/interfaces/IAuthMessagePublisher.service";
import { IPubSubService, IPubSubServiceToken } from "@/common/mq/IPubSubService";
import { User } from "@/user/models/User.model";

export class AuthMessagePublisherService implements IAuthMessagePublisherService {
    public constructor(
        @Inject(IPubSubServiceToken)
        private basePublisher: IPubSubService
    ) {}

    public onRegistrationStarted(user: User, confirmationToken: string): Observable<unknown> {
        const topic = "user_registration_started";
        const payload = { user, confirmationToken };
        return this.basePublisher.publish(topic, payload);
    }

    public onRegistrationConfirmed(user: User): Observable<unknown> {
        const topic = "user_registration_confirmed";
        const payload = { user };
        return this.basePublisher.publish(topic, payload);
    }
}
