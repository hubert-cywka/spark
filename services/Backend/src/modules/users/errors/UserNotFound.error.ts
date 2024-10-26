import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class UserNotFoundError extends EntityNotFoundError {
    constructor() {
        super("User not found.");
    }
}
