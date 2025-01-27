import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class DailyNotFoundError extends EntityNotFoundError {
    constructor() {
        super("Daily not found.");
    }
}
