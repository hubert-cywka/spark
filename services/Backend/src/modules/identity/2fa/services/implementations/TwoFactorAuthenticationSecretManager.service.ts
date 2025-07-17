import { Inject } from "@nestjs/common";
import { Secret } from "otpauth";

import { type IEncryptionAlgorithm } from "@/common/services/interfaces/IEncryptionAlgorithm";
import { type ITwoFactorAuthenticationSecretManager } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationSecretManager.service";
import { TwoFactorAuthSecretEncryptionAlgorithmToken } from "@/modules/identity/2fa/services/tokens/TwoFactorAuthSecretEncryptionAlgorithm.token";

export class TwoFactorAuthenticationSecretManager implements ITwoFactorAuthenticationSecretManager {
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
