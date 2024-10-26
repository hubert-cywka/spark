import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class InvalidCredentialsError extends EntityNotFoundError {
    constructor() {
        super("Invalid credentials.");
    }
}
