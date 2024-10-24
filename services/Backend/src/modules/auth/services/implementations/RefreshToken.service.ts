import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { IsNull, LessThanOrEqual, Repository } from "typeorm";

import { RefreshTokenEntity } from "@/modules/auth/entities/RefreshToken.entity";
import { RefreshTokenNotFoundError } from "@/modules/auth/errors/RefreshTokenNotFound.error";
import { IRefreshTokenService } from "@/modules/auth/services/interfaces/IRefreshToken.service";
import { AccessTokenPayload } from "@/modules/auth/types/accessTokenPayload";

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
    private logger = new Logger(RefreshTokenService.name);

    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private refreshTokenRepository: Repository<RefreshTokenEntity>
    ) {}

    public async sign(payload: AccessTokenPayload): Promise<string> {
        const secret = this.configService.getOrThrow<string>("modules.auth.refreshToken.signingSecret");
        const expiresIn = this.configService.getOrThrow<number>("modules.auth.refreshToken.expirationTimeInSeconds");

        const expiresAt = dayjs().add(expiresIn, "seconds").toDate();
        const token = await this.jwtService.signAsync(payload, {
            secret,
            expiresIn,
        });
        await this.save(token, payload.id, expiresAt);

        return token;
    }

    public async redeem(token: string): Promise<AccessTokenPayload> {
        const secret = this.configService.getOrThrow<string>("modules.auth.refreshToken.signingSecret");
        const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
            secret,
        });
        const tokenEntity = await this.findOneByValue(token);

        if (!tokenEntity || !this.isValid(tokenEntity)) {
            this.logger.error("Refresh token not found or already invalidated.", {
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
                expiresAt: now,
            });
        } else {
            await this.refreshTokenRepository.update({ value: token, expiresAt: IsNull() }, { expiresAt: now });
        }
    }

    private async invalidateAllByOwnerId(ownerId: string): Promise<void> {
        const now = dayjs().toDate();
        await this.refreshTokenRepository.update({ owner: { id: ownerId }, expiresAt: IsNull() }, { expiresAt: now });
    }

    private async save(value: string, ownerId: string, expiresAt: Date): Promise<RefreshTokenEntity | null> {
        const token = this.refreshTokenRepository.create({
            value,
            owner: { id: ownerId },
            expiresAt,
        });

        return this.refreshTokenRepository.save(token);
    }

    private async findOneByValue(value: string): Promise<RefreshTokenEntity | null> {
        return this.refreshTokenRepository.findOne({ where: { value } });
    }

    private isValid(token: RefreshTokenEntity): boolean {
        return dayjs(token.expiresAt).isAfter(new Date());
    }

    // TODO: Test if it works
    @Cron("0 1 * * *")
    private async deleteAllExpired(): Promise<void> {
        const now = dayjs().toDate();
        const result = await this.refreshTokenRepository.delete({
            expiresAt: LessThanOrEqual(now),
        });
        this.logger.log("Deleted expired tokens.", {
            count: result.affected,
            olderThan: now.toISOString(),
        });
    }
}
