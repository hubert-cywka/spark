import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class IntegrationNotFoundError extends EntityNotFoundError {
    constructor() {
        super("No eligible 2FA integration has been found.");
    }
}
