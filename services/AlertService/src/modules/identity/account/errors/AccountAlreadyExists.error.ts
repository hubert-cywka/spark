import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class AccountAlreadyExistsError extends EntityConflictError {
    constructor() {
        super("Account already exists.");
    }
}
