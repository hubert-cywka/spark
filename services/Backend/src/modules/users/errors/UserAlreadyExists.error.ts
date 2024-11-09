import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class UserAlreadyExistsError extends EntityConflictError {
    constructor() {
        super("User already exists.");
    }
}
