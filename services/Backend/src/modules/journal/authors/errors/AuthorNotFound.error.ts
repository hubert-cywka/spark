import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class AuthorNotFoundError extends EntityNotFoundError {
    constructor() {
        super("Author not found.");
    }
}
