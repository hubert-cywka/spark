import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { BaseSingleUseTokenService } from "@/modules/identity/account/services/implementations/BaseSingleUseToken.service";
import { type ISingleUseTokenService } from "@/modules/identity/account/services/interfaces/ISingleUseToken.service";
import { type SingleUseTokenRedeemData } from "@/modules/identity/account/types/SingleUseToken";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class PasswordResetTokenService extends BaseSingleUseTokenService implements ISingleUseTokenService {
    public constructor(
        @InjectRepository(SingleUseTokenEntity, IDENTITY_MODULE_DATA_SOURCE)
        repository: Repository<SingleUseTokenEntity>
    ) {
        super(repository);
    }

    public async invalidateAll(ownerId: string): Promise<void> {
        await this.invalidateAllByOwnerIdAndType(ownerId, "passwordChange");
    }

    public async issue(ownerId: string): Promise<string> {
        await this.invalidateAll(ownerId);
        return this.issueToken(ownerId, "passwordChange");
    }

    public async redeem(token: string): Promise<SingleUseTokenRedeemData> {
        return this.redeemToken(token, "passwordChange");
    }
}
