import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { BaseSingleUseTokenService } from "@/modules/identity/account/services/implementations/BaseSingleUseTokenService";
import { ISingleUseTokenService } from "@/modules/identity/account/services/interfaces/ISingleUseTokenService";
import { SingleUseTokenRedeemData } from "@/modules/identity/account/types/SingleUseToken";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class AccountActivationTokenService extends BaseSingleUseTokenService implements ISingleUseTokenService {
    public constructor(
        @InjectRepository(SingleUseTokenEntity, IDENTITY_MODULE_DATA_SOURCE)
        repository: Repository<SingleUseTokenEntity>
    ) {
        super(repository);
    }

    public async invalidateAll(ownerId: string): Promise<void> {
        await this.invalidateAllByOwnerIdAndType(ownerId, "accountActivation");
    }

    public async issue(ownerId: string): Promise<string> {
        await this.invalidateAll(ownerId);
        return this.issueToken(ownerId, "accountActivation");
    }

    public async redeem(token: string): Promise<SingleUseTokenRedeemData> {
        return this.redeemToken(token, "accountActivation");
    }
}
