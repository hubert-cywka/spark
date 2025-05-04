export interface IEncryptionAlgorithm {
    encrypt(payload: unknown): Promise<string>;
    decrypt<T = unknown>(payload: string): Promise<T>;
}
