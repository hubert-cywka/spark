import { ForbiddenError } from "@/common/errors/Forbidden.error";

export class AccessScopeUnavailableError extends ForbiddenError {
    public constructor() {
        super("Access scopes is not available.");
    }
}
