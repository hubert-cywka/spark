import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { IsNull, LessThanOrEqual, Repository } from "typeorm";

import { toSHA256 } from "@/common/utils/hashUtils";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { RefreshTokenNotFoundError } from "@/modules/identity/authentication/errors/RefreshTokenNotFound.error";
import { type IRefreshTokenService } from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { type AccessTokenPayload } from "@/modules/identity/authentication/types/Authentication";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
    private readonly logger = new Logger(RefreshTokenService.name);
    private readonly signingSecret: string;
    private readonly expirationTimeInSeconds: number;

    constructor(
        configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<RefreshTokenEntity>
    ) {
        this.signingSecret = configService.getOrThrow<string>("modules.identity.refreshToken.signingSecret");
        this.expirationTimeInSeconds = configService.getOrThrow<number>("modules.identity.refreshToken.expirationTimeInSeconds");
    }

    public async issue(payload: AccessTokenPayload): Promise<string> {
        const expiresAt = dayjs().add(this.expirationTimeInSeconds, "seconds").toDate();
        const token = await this.jwtService.signAsync(payload, {
            secret: this.signingSecret,
            expiresIn: this.expirationTimeInSeconds,
        });

        const hashedValue = await this.hashToken(token);
        await this.getRepository().save({
            owner: { id: payload.account.id },
            hashedValue,
            expiresAt,
        });

        return token;
    }

    public async redeem(token: string): Promise<AccessTokenPayload> {
        const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
            secret: this.signingSecret,
        });

        const tokenEntity = await this.findOneByHash(token);

        if (!tokenEntity || !this.isValid(tokenEntity)) {
            this.logger.error("No valid refresh tokens found.", {
                payload: payload,
                invalidatedAt: tokenEntity?.invalidatedAt ?? null,
            });
            await this.invalidateAllByOwnerId(payload.account.id);
            throw new RefreshTokenNotFoundError();
        }

        await this.invalidate(tokenEntity);
        return payload;
    }

    public async findOwner(token: string): Promise<string> {
        const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
            secret: this.signingSecret,
        });

        return payload.account.id;
    }

    public async invalidate(token: string): Promise<void>;
    public async invalidate(token: RefreshTokenEntity): Promise<void>;
    public async invalidate(token: RefreshTokenEntity | string): Promise<void> {
        const now = dayjs().toDate();

        if (token instanceof RefreshTokenEntity) {
            await this.getRepository().save({
                ...token,
                invalidatedAt: now,
            });
        } else {
            const hashedValue = await this.hashToken(token);
            await this.getRepository().update(
                {
                    hashedValue,
                    invalidatedAt: IsNull(),
                },
                { invalidatedAt: now }
            );
        }
    }

    public async invalidateAllByOwnerId(ownerId: string): Promise<void> {
        const now = dayjs().toDate();
        await this.getRepository().update(
            {
                owner: { id: ownerId },
                invalidatedAt: IsNull(),
            },
            { invalidatedAt: now }
        );
    }

    private async findOneByHash(token: string): Promise<RefreshTokenEntity | null> {
        const hashedValue = await this.hashToken(token);
        return this.getRepository().findOne({ where: { hashedValue } });
    }

    private async hashToken(value: string): Promise<string> {
        return toSHA256(value);
    }

    private isValid(token: RefreshTokenEntity): boolean {
        const now = dayjs().toDate();
        return dayjs(token.expiresAt).isAfter(now) && !token.invalidatedAt;
    }

    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    private async deleteAllExpired(): Promise<void> {
        const now = dayjs().toDate();
        const result = await this.getRepository().delete({
            expiresAt: LessThanOrEqual(now),
        });

        this.logger.log(
            {
                count: result.affected,
                olderThan: now.toISOString(),
            },
            "Deleted expired tokens."
        );
    }

    private getRepository(): Repository<RefreshTokenEntity> {
        return this.repository;
    }
}
