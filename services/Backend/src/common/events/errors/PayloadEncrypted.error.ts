export class PayloadEncryptedError extends Error {
    constructor() {
        super("Payload is encrypted. Decrypt it first.");
    }
}
