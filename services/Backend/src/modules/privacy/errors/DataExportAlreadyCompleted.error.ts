import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class DataExportAlreadyCompletedError extends EntityConflictError {
    constructor() {
        super("Data export has already been completed.");
    }
}
