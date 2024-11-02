import { ForbiddenError } from "@/common/errors/Forbidden.error";

export class TokenInvalidError extends ForbiddenError {
    constructor() {
        super("Token invalid.");
    }
}
