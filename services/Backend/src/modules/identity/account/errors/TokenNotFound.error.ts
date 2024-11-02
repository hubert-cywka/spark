import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class TokenNotFoundError extends EntityNotFoundError {
    constructor() {
        super("Token not found.");
    }
}
