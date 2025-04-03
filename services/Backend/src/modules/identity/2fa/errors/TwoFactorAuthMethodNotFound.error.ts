import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class TwoFactorAuthMethodNotFoundError extends EntityNotFoundError {
    constructor() {
        super("No eligible 2FA method has been found.");
    }
}
