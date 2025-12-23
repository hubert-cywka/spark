export const EmailLookupToken = Symbol("EmailLookupToken");

export interface IEmailLookup {
    findByRecipientId(id: string): Promise<string>;
}
