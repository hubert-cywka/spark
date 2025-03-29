import { AccessScope } from "@/common/types/AccessScope";

export const AccessScopesServiceToken = Symbol("AccessScopesService");

export interface IAccessScopesService {
    getByAccountId(accountId: string): AccessScope[];
    validate(required: AccessScope[], owned: AccessScope[]): boolean;
}
