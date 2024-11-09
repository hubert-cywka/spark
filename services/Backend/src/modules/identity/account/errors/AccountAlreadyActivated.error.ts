import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class AccountAlreadyActivatedError extends EntityConflictError {
    constructor() {
        super("Account is already activated.");
    }
}
