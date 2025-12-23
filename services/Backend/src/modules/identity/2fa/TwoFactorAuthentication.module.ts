import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AesGcmEncryptionAlgorithm } from "@/common/services/implementations/AesGcmEncryptionAlgorithm";
import { TwoFactorAuthenticationController } from "@/modules/identity/2fa/controllers/TwoFactorAuthentication.controller";
import { AccountActivatedEventHandler } from "@/modules/identity/2fa/events/AccountActivatedEvent.handler";
import { TwoFactorAuthenticationModuleFacadeToken } from "@/modules/identity/2fa/facade/ITwoFactorAuthenticationModule.facade";
import { TwoFactorAuthenticationModuleFacade } from "@/modules/identity/2fa/facade/TwoFactorAuthenticationModule.facade";
import { TwoFactorAuthenticationIntegrationMapperToken } from "@/modules/identity/2fa/mappers/ITwoFactorAuthenticationIntegration.mapper";
import { TwoFactorAuthenticationIntegrationMapper } from "@/modules/identity/2fa/mappers/TwoFactorAuthenticationIntegration.mapper";
import { TOTPSecretsManager } from "@/modules/identity/2fa/services/implementations/TOTPSecretsManager";
import { TwoFactorAuthenticationFactory } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthentication.factory";
import { TwoFactorAuthenticationEventsPublisher } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationEventsPublisher";
import { TwoFactorAuthenticationIntegrationsProvider } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationIntegrationsProvider";
import { TOTPSecretsManagerToken } from "@/modules/identity/2fa/services/interfaces/ITOTPSecretsManager";
import { TwoFactorAuthenticationFactoryToken } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.factory";
import { TwoFactorAuthenticationEventsPublisherToken } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationEventsPublisher";
import { TwoFactorAuthenticationMethodsProviderToken } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegrationsProvider";
import { TwoFactorAuthSecretEncryptionAlgorithmToken } from "@/modules/identity/2fa/services/tokens/TwoFactorAuthSecretEncryptionAlgorithm.token";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule],
    providers: [
        {
            provide: TwoFactorAuthenticationModuleFacadeToken,
            useClass: TwoFactorAuthenticationModuleFacade,
        },
        {
            provide: TwoFactorAuthSecretEncryptionAlgorithmToken,
            useFactory: (config: ConfigService) =>
                new AesGcmEncryptionAlgorithm(config.getOrThrow<string>("modules.identity.twoFactorAuth.encryptionSecret")),
            inject: [ConfigService],
        },
        {
            provide: TOTPSecretsManagerToken,
            useClass: TOTPSecretsManager,
        },
        {
            provide: TwoFactorAuthenticationIntegrationMapperToken,
            useClass: TwoFactorAuthenticationIntegrationMapper,
        },
        {
            provide: TwoFactorAuthenticationFactoryToken,
            useClass: TwoFactorAuthenticationFactory,
        },
        {
            provide: TwoFactorAuthenticationEventsPublisherToken,
            useClass: TwoFactorAuthenticationEventsPublisher,
        },
        {
            provide: TwoFactorAuthenticationMethodsProviderToken,
            useClass: TwoFactorAuthenticationIntegrationsProvider,
        },
        AccountActivatedEventHandler,
    ],
    controllers: [TwoFactorAuthenticationController],
    exports: [TwoFactorAuthenticationModuleFacadeToken, AccountActivatedEventHandler],
})
export class TwoFactorAuthenticationModule {}
