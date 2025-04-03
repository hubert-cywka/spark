import { ForbiddenException } from "@nestjs/common";

import { AccessScope } from "@/common/types/AccessScope";

export class InsufficientAccessError extends ForbiddenException {
    constructor(scopes: AccessScope[]) {
        super(`Insufficient access. Required scopes are: ${scopes.join(", ")}.`);
    }
}
