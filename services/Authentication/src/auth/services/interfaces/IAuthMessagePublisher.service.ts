import { Observable } from "rxjs";

import { User } from "@/user/models/User.model";

export const IAuthMessagePublisherServiceToken = Symbol("IAuthMessagePublisherServiceToken");

export interface IAuthMessagePublisherService {
    onRegistrationStarted(user: User, confirmationToken: string): Observable<unknown>;
    onRegistrationConfirmed(user: User): Observable<unknown>;
}
