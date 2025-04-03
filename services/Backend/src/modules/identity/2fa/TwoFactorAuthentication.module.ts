import { Module } from "@nestjs/common";

import { TwoFactorAuthenticationController } from "@/modules/identity/2fa/controllers/TwoFactorAuthentication.controller";
import { AccountActivatedEventHandler } from "@/modules/identity/2fa/events/AccountActivatedEvent.handler";
import { TwoFactorAuthenticationIntegrationMapperToken } from "@/modules/identity/2fa/mappers/ITwoFactorAuthenticationIntegration.mapper";
import { TwoFactorAuthenticationIntegrationMapper } from "@/modules/identity/2fa/mappers/TwoFactorAuthenticationIntegration.mapper";
import { TwoFactorAuthenticationFactory } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthentication.factory";
import { TwoFactorAuthenticationEmailIntegrationPublisherService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationEmailIntegrationPublisher.service";
import { TwoFactorAuthenticationIntegrationsProviderService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationIntegrationsProvider.service";
import { TwoFactorAuthenticationFactoryToken } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.factory";
import { TwoFactorAuthenticationEmailIntegrationPublisherServiceToken } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationEmailIntegrationPublisher.service";
import { TwoFactorAuthenticationMethodsProviderServiceToken } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegrationsProvider.service";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule],
    providers: [
        {
            provide: TwoFactorAuthenticationIntegrationMapperToken,
            useClass: TwoFactorAuthenticationIntegrationMapper,
        },
        {
            provide: TwoFactorAuthenticationFactoryToken,
            useClass: TwoFactorAuthenticationFactory,
        },
        {
            provide: TwoFactorAuthenticationEmailIntegrationPublisherServiceToken,
            useClass: TwoFactorAuthenticationEmailIntegrationPublisherService,
        },
        {
            provide: TwoFactorAuthenticationMethodsProviderServiceToken,
            useClass: TwoFactorAuthenticationIntegrationsProviderService,
        },
        AccountActivatedEventHandler,
    ],
    controllers: [TwoFactorAuthenticationController],
    exports: [TwoFactorAuthenticationFactoryToken, AccountActivatedEventHandler],
})
export class TwoFactorAuthenticationModule {}
