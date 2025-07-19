import { Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";

import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import {
    type ITwoFactorAuthenticationIntegrationMapper,
    TwoFactorAuthenticationIntegrationMapperToken,
} from "@/modules/identity/2fa/mappers/ITwoFactorAuthenticationIntegration.mapper";
import { type ITOTPSecretsManager, TOTPSecretsManagerToken } from "@/modules/identity/2fa/services/interfaces/ITOTPSecretsManager.service";
import { type ITwoFactorAuthenticationIntegrationsProviderService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegrationsProvider.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

export class TwoFactorAuthenticationIntegrationsProviderService implements ITwoFactorAuthenticationIntegrationsProviderService {
    private readonly logger = new Logger(TwoFactorAuthenticationIntegrationsProviderService.name);

    public constructor(
        @InjectRepository(TwoFactorAuthenticationIntegrationEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<TwoFactorAuthenticationIntegrationEntity>,
        @Inject(TwoFactorAuthenticationIntegrationMapperToken)
        private readonly mapper: ITwoFactorAuthenticationIntegrationMapper,
        @Inject(TOTPSecretsManagerToken)
        private readonly secretManager: ITOTPSecretsManager
    ) {}

    public async findActiveIntegrations(accountId: string) {
        const result = await this.getRepository().find({
            where: { owner: { id: accountId }, enabledAt: Not(IsNull()) },
        });

        return this.mapper.fromEntityToModelBulk(result);
    }

    // TODO: Is this the correct place for this?
    public async enableDefaultIntegrations(accountId: string): Promise<void> {
        const repository = this.getRepository();
        const { encryptedSecret } = await this.secretManager.generateSecret();

        await repository.save({
            owner: { id: accountId },
            method: TwoFactorAuthenticationMethod.EMAIL,
            enabledAt: new Date(),
            secret: encryptedSecret,
        });

        this.logger.log({ accountId }, "Enabled default 2FA integrations.");
    }

    private getRepository(): Repository<TwoFactorAuthenticationIntegrationEntity> {
        return this.repository;
    }
}
