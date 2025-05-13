import { Injectable, Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";
import { IsNull, Repository } from "typeorm";

import { toSHA256 } from "@/common/utils/hashUtils";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { TokenInvalidError } from "@/modules/identity/account/errors/TokenInvalid.error";
import { TokenNotFoundError } from "@/modules/identity/account/errors/TokenNotFound.error";
import { type ISingleUseTokenService } from "@/modules/identity/account/services/interfaces/ISingleUseToken.service";
import { type SingleUseTokenRedeemData, type SingleUseTokenType } from "@/modules/identity/account/types/SingleUseToken";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export abstract class BaseSingleUseTokenService implements ISingleUseTokenService {
    private readonly logger = new Logger(BaseSingleUseTokenService.name);
    private readonly EXPIRATION_TIME = 15 * 60;

    protected constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public abstract issue(ownerId: string): Promise<string>;
    public abstract redeem(token: string): Promise<SingleUseTokenRedeemData>;
    public abstract invalidateAll(ownerId: string): Promise<void>;

    protected async redeemToken(token: string, type: SingleUseTokenType): Promise<SingleUseTokenRedeemData> {
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
        await this.getRepository().save({ ...tokenEntity, usedAt: now });

        return { ownerId: tokenEntity.owner.id };
    }

    protected async issueToken(ownerId: string, type: SingleUseTokenType): Promise<string> {
        const token = this.generate();
        const expiresAt = dayjs().add(this.EXPIRATION_TIME, "seconds");

        const hashedValue = await this.hashToken(token);
        await this.getRepository().save({
            owner: { id: ownerId },
            type,
            value: hashedValue,
            expiresAt,
        });

        return token;
    }

    protected async invalidateAllByOwnerIdAndType(ownerId: string, type: SingleUseTokenType): Promise<void> {
        const now = dayjs();
        await this.getRepository().update({ owner: { id: ownerId }, invalidatedAt: IsNull(), type }, { invalidatedAt: now });
    }

    private async findOneByValueAndType(value: string, type: SingleUseTokenType): Promise<SingleUseTokenEntity | null> {
        const hashedValue = await this.hashToken(value);

        return this.getRepository().findOne({
            where: { value: hashedValue, type },
            relations: ["owner"],
        });
    }

    private async hashToken(value: string): Promise<string> {
        return toSHA256(value);
    }

    private isValid(token: SingleUseTokenEntity): boolean {
        const now = dayjs();
        return dayjs(token.expiresAt).isAfter(now) && !token.invalidatedAt && !token.usedAt;
    }

    private generate(): string {
        return crypto.randomUUID();
    }

    private getRepository(): Repository<SingleUseTokenEntity> {
        return this.txHost.tx.getRepository(SingleUseTokenEntity);
    }
}
