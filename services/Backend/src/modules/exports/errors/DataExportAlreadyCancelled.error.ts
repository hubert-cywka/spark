import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class DataExportAlreadyCancelledError extends EntityConflictError {
    constructor() {
        super("Data export has already been cancelled.");
    }
}
