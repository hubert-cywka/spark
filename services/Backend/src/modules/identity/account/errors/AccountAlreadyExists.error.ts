import { EntityConflictError } from "@/common/errors/EntityConflictError";

export class AccountAlreadyExistsError extends EntityConflictError {
    constructor() {
        super("Account already exists.");
    }
}
