import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class AccountNotFoundError extends EntityNotFoundError {
    constructor() {
        super("Account not found.");
    }
}
