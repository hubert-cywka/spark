import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class AnotherDataExportActiveError extends EntityConflictError {
    constructor() {
        super("Another data export is already in progress.");
    }
}
