import { EntityConflictError } from "@/common/errors/EntityConflict.error";

export class TenantAlreadyExistsError extends EntityConflictError {
    public constructor() {
        super("Tenant already exists.");
    }
}
