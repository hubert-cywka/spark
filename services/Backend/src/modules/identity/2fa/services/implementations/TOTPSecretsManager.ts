import { Inject } from "@nestjs/common";
import { Secret } from "otpauth";

import { type IEncryptionAlgorithm } from "@/common/services/interfaces/IEncryptionAlgorithm";
import { type ITOTPSecretsManager } from "@/modules/identity/2fa/services/interfaces/ITOTPSecretsManager";
import { TwoFactorAuthSecretEncryptionAlgorithmToken } from "@/modules/identity/2fa/services/tokens/TwoFactorAuthSecretEncryptionAlgorithm.token";

export class TOTPSecretsManager implements ITOTPSecretsManager {
    public constructor(
        @Inject(TwoFactorAuthSecretEncryptionAlgorithmToken)
        private readonly encryptionAlgorithm: IEncryptionAlgorithm
    ) {}

    public async generateSecret() {
        const decryptedSecret = new Secret().base32;
        const encryptedSecret = await this.encryptionAlgorithm.encrypt(decryptedSecret);
        return { decryptedSecret, encryptedSecret };
    }

    public decryptSecret(encryptedSecret: string) {
        return this.encryptionAlgorithm.decrypt<string>(encryptedSecret);
    }

    public encryptSecret(decryptedSecret: string) {
        return this.encryptionAlgorithm.encrypt(decryptedSecret);
    }
}
