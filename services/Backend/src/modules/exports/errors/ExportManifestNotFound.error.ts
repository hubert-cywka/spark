import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class ExportManifestNotFoundError extends EntityNotFoundError {
    constructor() {
        super("Export manifest not found, file may not be available.");
    }
}
