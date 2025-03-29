import { Injectable } from "@nestjs/common";

import { type IAuthorizationService } from "@/modules/identity/authorization/services/interfaces/IAuthorization.service";
import { type User } from "@/types/User";

@Injectable()
export class AuthorizationService implements IAuthorizationService {
    constructor() {}

    public getSudoAuthorizationMethod(user: User): unknown {
        return 1;
    }
}
