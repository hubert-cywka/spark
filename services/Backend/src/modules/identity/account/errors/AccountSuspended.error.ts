import { ForbiddenError } from "@/common/errors/Forbidden.error";

export class AccountSuspendedError extends ForbiddenError {
    constructor() {
        super("Account is suspended.");
    }
}
