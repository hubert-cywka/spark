import { ForbiddenError } from "@/common/errors/Forbidden.error";

export class UserNotActivatedError extends ForbiddenError {
    constructor() {
        super("User not activated.");
    }
}
