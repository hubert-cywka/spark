import { OperationNotSupportedError } from "@/common/errors/OperationNotSupported.error";

export class TOTPIssuingNotSupportedError extends OperationNotSupportedError {
    constructor() {
        super("This 2FA integration does not support issuing codes on demand.");
    }
}
