export const TOTPSecretsManagerToken = Symbol("TOTPSecretsManager");

export interface ITOTPSecretsManager {
    generateSecret(): Promise<{
        encryptedSecret: string;
        decryptedSecret: string;
    }>;
    decryptSecret(secret: string): Promise<string>;
    encryptSecret(secret: string): Promise<string>;
}
