import { Inject, Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { TwoFactorAuthenticationOptionEntity } from "@/modules/identity/authentication/entities/TwoFactorAuthenticationOption.entity";
import {
    type ITwoFactorAuthenticationOptionMapper,
    TwoFactorAuthenticationOptionMapperToken,
} from "@/modules/identity/authentication/mappers/ITwoFactorAuthenticationOption.mapper";
import { type ITwoFactorAuthenticationService } from "@/modules/identity/authentication/services/interfaces/ITwoFactorAuthentication.service";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class Email2FAService implements ITwoFactorAuthenticationService {
    constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(TwoFactorAuthenticationOptionMapperToken)
        private readonly twoFactorAuthMapper: ITwoFactorAuthenticationOptionMapper
    ) {}

    private getRepository(): Repository<TwoFactorAuthenticationOptionEntity> {
        return this.txHost.tx.getRepository(TwoFactorAuthenticationOptionEntity);
    }
}
