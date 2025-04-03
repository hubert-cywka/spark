import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class IntegrationAlreadyEnabledError extends EntityConflictError {
    constructor() {
        super("This 2FA integration is already enabled.");
    }
}
