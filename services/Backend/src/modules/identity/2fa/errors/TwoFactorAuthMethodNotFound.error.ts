import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class TwoFactorAuthMethodNotFoundError extends EntityConflictError {
    constructor() {
        super("No eligible 2FA method has been found.");
    }
}
