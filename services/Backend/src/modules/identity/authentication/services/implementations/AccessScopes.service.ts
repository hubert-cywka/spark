import { Injectable, Logger } from "@nestjs/common";

import { type AccessScopes, AccessScope } from "@/common/types/AccessScope";
import { AccessScopeUnavailableError } from "@/modules/identity/authentication/errors/AccessScopeUnavailable.error";
import { type IAccessScopesService } from "@/modules/identity/authentication/services/interfaces/IAccessScopes.service";

@Injectable()
export class AccessScopesService implements IAccessScopesService {
    private readonly logger = new Logger(AccessScopesService.name);

    // TODO: For now it's fine to have default set of scopes for everyone.
    public getByAccountId(_accountId: string): AccessScopes {
        return {
            active: [
                "read:account",
                "read:entry",
                "read:goal",
                "read:daily",
                "read:alert",
                "read:2fa",
                "write:account",
                "write:goal",
                "write:entry",
                "write:daily",
                "write:alert",
                "delete:entry",
                "delete:goal",
                "delete:daily",
                "delete:alert",
            ],
            inactive: ["write:2fa", "delete:2fa", "delete:account"],
        };
    }

    public activate(accountId: string, scopesToActivate: AccessScope[]): AccessScopes {
        const scopes = this.getByAccountId(accountId);
        const activeScopes = [...scopes.active];
        let inactiveScopes = [...scopes.inactive];

        scopesToActivate.forEach((scopeToActivate) => {
            if (inactiveScopes.includes(scopeToActivate)) {
                activeScopes.push(scopeToActivate);
                inactiveScopes = inactiveScopes.filter((scopeToFilterOut) => scopeToActivate !== scopeToFilterOut);
            } else if (!activeScopes.includes(scopeToActivate)) {
                this.logger.warn({ accountId, scopeToActivate }, "Cannot activate access scope.");
                throw new AccessScopeUnavailableError();
            }
        });

        return {
            active: activeScopes,
            inactive: inactiveScopes,
        };
    }
}
