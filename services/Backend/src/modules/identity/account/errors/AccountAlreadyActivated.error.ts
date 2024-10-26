import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";

export class AccountAlreadyActivatedError extends EntityAlreadyExistsError {
    constructor() {
        super("Account is already activated.");
    }
}
