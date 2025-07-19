import { Inject } from "@nestjs/common";

import { type ITwoFactorAuthenticationModuleFacade } from "@/modules/identity/2fa/facade/ITwoFactorAuthenticationModule.facade";
import {
    type ITwoFactorAuthenticationFactory,
    TwoFactorAuthenticationFactoryToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.factory";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { User } from "@/types/User";

export class TwoFactorAuthenticationModuleFacade implements ITwoFactorAuthenticationModuleFacade {
    public constructor(
        @Inject(TwoFactorAuthenticationFactoryToken)
        private readonly twoFactorAuthFactory: ITwoFactorAuthenticationFactory
    ) {}

    async validateTOTP(user: User, code: string, method: TwoFactorAuthenticationMethod) {
        const twoFactorAuthService = this.twoFactorAuthFactory.createIntegrationService(method);
        return await twoFactorAuthService.validateTOTP(user, code);
    }
}
