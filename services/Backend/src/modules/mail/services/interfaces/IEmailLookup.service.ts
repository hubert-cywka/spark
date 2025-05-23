export const EmailLookupServiceToken = Symbol("EmailLookupServiceToken");

export interface IEmailLookupService {
    findByRecipientId(id: string): Promise<string>;
}
