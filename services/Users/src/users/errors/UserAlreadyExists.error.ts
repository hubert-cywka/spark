import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";

export class UserAlreadyExistsError extends EntityAlreadyExistsError {
    constructor() {
        super("User already exists.");
    }
}
