import { Module } from "@nestjs/common";

import { TwoFactorAuthenticationController } from "@/modules/identity/2fa/controllers/TwoFactorAuthentication.controller";
import { TwoFactorAuthenticationOptionMapperToken } from "@/modules/identity/2fa/mappers/ITwoFactorAuthenticationOption.mapper";
import { TwoFactorAuthenticationOptionMapper } from "@/modules/identity/2fa/mappers/TwoFactorAuthenticationOption.mapper";
import { TwoFactorAuthenticationFactory } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthentication.factory";
import { TwoFactorAuthenticationMethodsProviderService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationMethodsProvider.service";
import { TwoFactorAuthenticationPublisherService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationPublisher.service";
import { TwoFactorAuthenticationFactoryToken } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.factory";
import { TwoFactorAuthenticationMethodsProviderServiceToken } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationMethodsProvider.service";
import { TwoFactorAuthenticationPublisherServiceToken } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationPublisher.service";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule],
    providers: [
        {
            provide: TwoFactorAuthenticationOptionMapperToken,
            useClass: TwoFactorAuthenticationOptionMapper,
        },
        {
            provide: TwoFactorAuthenticationFactoryToken,
            useClass: TwoFactorAuthenticationFactory,
        },
        {
            provide: TwoFactorAuthenticationPublisherServiceToken,
            useClass: TwoFactorAuthenticationPublisherService,
        },
        {
            provide: TwoFactorAuthenticationMethodsProviderServiceToken,
            useClass: TwoFactorAuthenticationMethodsProviderService,
        },
    ],
    controllers: [TwoFactorAuthenticationController],
    exports: [TwoFactorAuthenticationFactoryToken],
})
export class TwoFactorAuthenticationModule {}
