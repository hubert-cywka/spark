import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class AlertLimitReachedError extends EntityConflictError {
    public constructor() {
        super("Maximum number of alerts reached.");
    }
}
