import { AccessScopes } from "@/common/types/AccessScope";

export const AccessScopesServiceToken = Symbol("AccessScopesService");

export interface IAccessScopesService {
    getByAccountId(accountId: string): AccessScopes;
}
