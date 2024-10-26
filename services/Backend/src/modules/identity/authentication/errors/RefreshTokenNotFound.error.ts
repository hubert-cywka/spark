import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class RefreshTokenNotFoundError extends EntityNotFoundError {
    constructor() {
        super("Couldn't find any valid refresh token.");
    }
}
