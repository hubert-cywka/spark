import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class DataExportNotFoundError extends EntityNotFoundError {
    constructor() {
        super("Data export not found.");
    }
}
