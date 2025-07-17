export const TwoFactorAuthenticationSecretManagerToken = Symbol("TwoFactorAuthenticationSecretManager");

export interface ITwoFactorAuthenticationSecretManager {
    generateSecret(): Promise<{
        encryptedSecret: string;
        decryptedSecret: string;
    }>;
    decryptSecret(secret: string): Promise<string>;
    encryptSecret(secret: string): Promise<string>;
}
