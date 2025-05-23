import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class RecipientNotFoundError extends EntityNotFoundError {
    constructor() {
        super("Recipient not found.");
    }
}
