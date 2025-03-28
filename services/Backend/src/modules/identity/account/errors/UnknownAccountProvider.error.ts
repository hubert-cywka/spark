import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class UnknownAccountProviderError extends EntityNotFoundError {
    constructor() {
        super("Unknown account provider.");
    }
}
