import { Injectable } from "@nestjs/common";

import { AccessScope } from "@/common/types/AccessScope";
import { type IAccessScopesService } from "@/modules/identity/authorization/services/interfaces/IAccessScopes.service";

@Injectable()
export class AccessScopesService implements IAccessScopesService {
    constructor() {}

    // TODO: For now it's fine to have default set of scopes for everyone.
    public getByAccountId(_accountId: string): AccessScope[] {
        return [
            "read:account",
            "read:entry",
            "read:goal",
            "read:daily",
            "read:alert",
            "write:account",
            "write:goal",
            "write:entry",
            "write:daily",
            "write:alert",
            "delete:entry",
            "delete:goal",
            "delete:daily",
            "delete:alert",
        ];
    }
}
