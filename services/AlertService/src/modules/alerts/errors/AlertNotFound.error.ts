import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class AlertNotFoundError extends EntityNotFoundError {
    public constructor() {
        super("Alert does not exist.");
    }
}
