import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { IsNull, LessThanOrEqual, Repository } from "typeorm";

import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { RefreshTokenNotFoundError } from "@/modules/identity/authentication/errors/RefreshTokenNotFound.error";
import { IRefreshTokenService } from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { AccessTokenPayload } from "@/modules/identity/authentication/types/accessTokenPayload";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants/connectionName";

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
    private readonly logger: Logger;
    private readonly signingSecret: string;
    private readonly expirationTimeInSeconds: number;

    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity, IDENTITY_MODULE_DATA_SOURCE)
        private refreshTokenRepository: Repository<RefreshTokenEntity>
    ) {
        this.logger = new Logger(RefreshTokenService.name);
        this.signingSecret = configService.getOrThrow<string>("modules.auth.refreshToken.signingSecret");
        this.expirationTimeInSeconds = configService.getOrThrow<number>("modules.auth.refreshToken.expirationTimeInSeconds");
    }

    public async issue(payload: AccessTokenPayload): Promise<string> {
        const expiresAt = dayjs().add(this.expirationTimeInSeconds, "seconds").toDate();
        const token = await this.jwtService.signAsync(payload, {
            secret: this.signingSecret,
            expiresIn: this.expirationTimeInSeconds,
        });

        const hashedValue = await this.hashToken(token);
        await this.refreshTokenRepository.save({
            owner: { id: payload.id },
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
            await this.invalidateAllByOwnerId(payload.id);
            throw new RefreshTokenNotFoundError();
        }

        await this.invalidate(tokenEntity);
        return payload;
    }

    public async invalidate(token: string): Promise<void>;
    public async invalidate(token: RefreshTokenEntity): Promise<void>;
    public async invalidate(token: RefreshTokenEntity | string): Promise<void> {
        const now = dayjs().toDate();

        if (token instanceof RefreshTokenEntity) {
            await this.refreshTokenRepository.save({
                ...token,
                invalidatedAt: now,
            });
        } else {
            const hashedValue = await this.hashToken(token);
            await this.refreshTokenRepository.update(
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
        await this.refreshTokenRepository.update(
            {
                owner: { id: ownerId },
                invalidatedAt: IsNull(),
            },
            { invalidatedAt: now }
        );
    }

    private async findOneByHash(token: string): Promise<RefreshTokenEntity | null> {
        const hashedValue = await this.hashToken(token);
        return this.refreshTokenRepository.findOne({ where: { hashedValue } });
    }

    private async hashToken(value: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(value);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    private isValid(token: RefreshTokenEntity): boolean {
        const now = dayjs().toDate();
        return dayjs(token.expiresAt).isAfter(now) && !token.invalidatedAt;
    }

    @Cron("0 1 * * *")
    private async deleteAllExpired(): Promise<void> {
        const now = dayjs().toDate();
        const result = await this.refreshTokenRepository.delete({
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
}
