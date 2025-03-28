import { ForbiddenError } from "@/common/errors/Forbidden.error";

// TODO: Handle this error on UI.
export class AccountSuspendedError extends ForbiddenError {
    constructor() {
        super("Account is suspended.");
    }
}
