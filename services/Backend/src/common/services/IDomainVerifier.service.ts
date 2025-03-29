export const DomainVerifierServiceToken = Symbol("DomainVerifierService");

export interface IDomainVerifierService {
    verify(...url: (URL | string)[]): boolean;
}
