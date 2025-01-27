import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class GoalNotFoundError extends EntityNotFoundError {
    public constructor() {
        super("Goal not found.");
    }
}
