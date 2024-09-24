export const IMailServiceToken = Symbol("IMailServiceToken");

export interface IMailService {
    test(payload: unknown): unknown;
}
