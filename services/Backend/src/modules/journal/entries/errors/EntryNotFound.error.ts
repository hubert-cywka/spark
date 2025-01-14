import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class EntryNotFoundError extends EntityNotFoundError {
    constructor() {
        super("Entry not found.");
    }
}
