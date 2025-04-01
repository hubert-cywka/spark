import { Inject, Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { IsNull, Not, Repository } from "typeorm";

import { TwoFactorAuthenticationOptionEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationOption.entity";
import {
    type ITwoFactorAuthenticationOptionMapper,
    TwoFactorAuthenticationOptionMapperToken,
} from "@/modules/identity/2fa/mappers/ITwoFactorAuthenticationOption.mapper";
import { ITwoFactorAuthenticationMethodsProviderService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationMethodsProvider.service";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

export class TwoFactorAuthenticationMethodsProviderService implements ITwoFactorAuthenticationMethodsProviderService {
    private readonly logger = new Logger(TwoFactorAuthenticationMethodsProviderService.name);

    public constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(TwoFactorAuthenticationOptionMapperToken)
        private readonly mapper: ITwoFactorAuthenticationOptionMapper
    ) {}

    public async findEnabledMethods(accountId: string) {
        const result = await this.getRepository().find({
            where: { owner: { id: accountId }, enabledAt: Not(IsNull()) },
        });

        return this.mapper.fromEntityToModelBulk(result);
    }

    private getRepository(): Repository<TwoFactorAuthenticationOptionEntity> {
        return this.txHost.tx.getRepository(TwoFactorAuthenticationOptionEntity);
    }
}
