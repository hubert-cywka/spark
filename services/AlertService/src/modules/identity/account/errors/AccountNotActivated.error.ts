import { ForbiddenError } from "@/common/errors/Forbidden.error";

export class AccountNotActivatedError extends ForbiddenError {
    constructor() {
        super("Account not activated.");
    }
}
