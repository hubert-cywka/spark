export const DomainVerifierToken = Symbol("DomainVerifierToken");

export interface IDomainVerifier {
    verify(...url: (URL | string)[]): boolean;
}
