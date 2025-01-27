import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class GoalEntryLinkNotFoundError extends EntityNotFoundError {
    public constructor() {
        super("Goal and entry link not found.");
    }
}
