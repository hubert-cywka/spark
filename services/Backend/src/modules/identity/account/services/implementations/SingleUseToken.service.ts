import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import type { Repository } from "typeorm";
import { IsNull } from "typeorm";

import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { TokenInvalidError } from "@/modules/identity/account/errors/TokenInvalid.error";
import { TokenNotFoundError } from "@/modules/identity/account/errors/TokenNotFound.error";
import { ManagedAccountService } from "@/modules/identity/account/services/implementations/ManagedAccount.service";
import { type ISingleUseTokenService } from "@/modules/identity/account/services/interfaces/ISingleUseToken.service";
import { type SingleUseTokenRedeemData, type SingleUseTokenType } from "@/modules/identity/account/types/SingleUseToken";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class SingleUseTokenService implements ISingleUseTokenService {
    private readonly logger = new Logger(ManagedAccountService.name);
    private readonly EXPIRATION_TIME = 15 * 60;

    constructor(
        @InjectRepository(SingleUseTokenEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<SingleUseTokenEntity>
    ) {}

    public async invalidateAllAccountActivationTokens(ownerId: string): Promise<void> {
        await this.invalidateAllByOwnerIdAndType(ownerId, "accountActivation");
    }

    public async issueAccountActivationToken(ownerId: string): Promise<string> {
        await this.invalidateAllAccountActivationTokens(ownerId);
        return this.issueToken(ownerId, "accountActivation");
    }

    public async redeemAccountActivationToken(token: string): Promise<SingleUseTokenRedeemData> {
        return this.redeemToken(token, "accountActivation");
    }

    public async invalidateAllPasswordChangeTokens(ownerId: string): Promise<void> {
        await this.invalidateAllByOwnerIdAndType(ownerId, "passwordChange");
    }

    public async issuePasswordChangeToken(ownerId: string): Promise<string> {
        await this.invalidateAllPasswordChangeTokens(ownerId);
        return this.issueToken(ownerId, "passwordChange");
    }

    public async redeemPasswordChangeToken(token: string): Promise<SingleUseTokenRedeemData> {
        return this.redeemToken(token, "passwordChange");
    }

    private async redeemToken(token: string, type: SingleUseTokenType): Promise<SingleUseTokenRedeemData> {
        const tokenEntity = await this.findOneByValueAndType(token, type);

        if (!tokenEntity) {
            this.logger.warn({ token, type }, "Single-use token not found.");
            throw new TokenNotFoundError();
        }

        if (!this.isValid(tokenEntity)) {
            this.logger.error(
                {
                    token,
                    type,
                    expiredAt: tokenEntity.expiresAt,
                    usedAt: tokenEntity.usedAt,
                    invalidatedAt: tokenEntity.invalidatedAt,
                },
                "Single-use token is invalid."
            );
            throw new TokenInvalidError();
        }

        const now = dayjs().toDate();
        await this.repository.save({ ...tokenEntity, usedAt: now });

        return { ownerId: tokenEntity.owner.id };
    }

    private async issueToken(ownerId: string, type: SingleUseTokenType): Promise<string> {
        const token = this.generate();
        const expiresAt = dayjs().add(this.EXPIRATION_TIME, "seconds");
        const tokenEntity = await this.repository.save({
            owner: { id: ownerId },
            type,
            value: token,
            expiresAt,
        });
        return tokenEntity.value;
    }

    private async invalidateAllByOwnerIdAndType(ownerId: string, type: SingleUseTokenType): Promise<void> {
        const now = dayjs();
        await this.repository.update({ owner: { id: ownerId }, invalidatedAt: IsNull(), type }, { invalidatedAt: now });
    }

    private async findOneByValueAndType(value: string, type: SingleUseTokenType): Promise<SingleUseTokenEntity | null> {
        return this.repository.findOne({
            where: { value, type },
            relations: ["owner"],
        });
    }

    private isValid(token: SingleUseTokenEntity): boolean {
        const now = dayjs();
        return dayjs(token.expiresAt).isAfter(now) && !token.invalidatedAt && !token.usedAt;
    }

    private generate(): string {
        return crypto.randomUUID();
    }
}
