import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class NotEnoughIntegrationsEnabledError extends EntityConflictError {
    constructor() {
        super("At least one enabled 2FA integration is required.");
    }
}
