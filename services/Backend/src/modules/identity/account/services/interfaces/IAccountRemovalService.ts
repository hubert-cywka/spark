export const AccountRemovalServiceToken = Symbol("AccountRemovalService");

export interface IAccountRemovalService {
    removeByInternalId(accountId: string): Promise<void>;
    suspendByInternalId(accountId: string): Promise<void>;
}
