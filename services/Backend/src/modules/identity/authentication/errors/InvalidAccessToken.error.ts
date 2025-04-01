import { ForbiddenError } from "@/common/errors/Forbidden.error";

export class InvalidAccessTokenError extends ForbiddenError {
    constructor() {
        super("Invalid access token.");
    }
}
