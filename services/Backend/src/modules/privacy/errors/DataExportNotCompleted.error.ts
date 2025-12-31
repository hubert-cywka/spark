import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class DataExportNotCompletedError extends EntityConflictError {
    constructor() {
        super("Data export has not been completed yet.");
    }
}
