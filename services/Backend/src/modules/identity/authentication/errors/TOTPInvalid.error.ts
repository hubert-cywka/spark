import { ForbiddenError } from "@/common/errors/Forbidden.error";

export class TOTPInvalidError extends ForbiddenError {
    constructor() {
        super("Invalid TOTP.");
    }
}
