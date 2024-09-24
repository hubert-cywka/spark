import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";

export class UserAlreadyActivatedError extends EntityAlreadyExistsError {
    constructor() {
        super("User is already activated.");
    }
}
