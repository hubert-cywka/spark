import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class AtLeastOne2FAMethodRequiredError extends EntityConflictError {
    constructor() {
        super("At least one enabled 2FA method is required.");
    }
}
