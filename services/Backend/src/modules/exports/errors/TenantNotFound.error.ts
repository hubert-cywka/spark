import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class TenantNotFoundError extends EntityNotFoundError {
    constructor() {
        super("Tenant not found.");
    }
}
