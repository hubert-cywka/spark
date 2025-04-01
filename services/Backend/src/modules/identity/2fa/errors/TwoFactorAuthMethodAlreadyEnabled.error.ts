import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class TwoFactorAuthMethodAlreadyEnabledError extends EntityConflictError {
    constructor() {
        super("This 2FA method is already enabled.");
    }
}
