import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class AuthorAlreadyExistsError extends EntityConflictError {
    public constructor() {
        super("Author already exists.");
    }
}
