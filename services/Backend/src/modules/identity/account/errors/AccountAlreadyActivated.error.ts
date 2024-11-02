import { EntityConflictError } from "@/common/errors/EntityConflictError";

export class AccountAlreadyActivatedError extends EntityConflictError {
    constructor() {
        super("Account is already activated.");
    }
}
