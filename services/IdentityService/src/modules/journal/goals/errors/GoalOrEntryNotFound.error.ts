import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class GoalOrEntryNotFoundError extends EntityNotFoundError {
    public constructor() {
        super("Goal or entry not found.");
    }
}
