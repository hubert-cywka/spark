import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class RecipientAlreadyExistsError extends EntityConflictError {
    public constructor() {
        super("Recipient already exists.");
    }
}
