import { DataCorruptionError } from "@/common/errors/DataCorruption.error";

export class AccountCorruptedError extends DataCorruptionError {
    constructor() {
        super("Account has corrupted data.");
    }
}
