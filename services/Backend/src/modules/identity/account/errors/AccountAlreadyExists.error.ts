import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";

export class AccountAlreadyExistsError extends EntityAlreadyExistsError {
    constructor() {
        super("Account already exists.");
    }
}
