import { OperationNotSupportedError } from "@/common/errors/OperationNotSupported.error";

export class IssuingCodesNotSupportedError extends OperationNotSupportedError {
    constructor() {
        super("This 2FA method does not support issuing codes on demand.");
    }
}
