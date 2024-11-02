import { EntityConflictError } from "@/common/errors/EntityConflictError";

export class UserAlreadyExistsError extends EntityConflictError {
    constructor() {
        super("User already exists.");
    }
}
