import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "./Auth.controller";

import { RefreshTokenEntity } from "@/auth/entities/RefreshToken.entity";
import { AuthService } from "@/auth/services/Auth.service";
import { IAuthServiceToken } from "@/auth/services/IAuth.service";
import { IRefreshTokenServiceToken } from "@/auth/services/IRefreshToken.service";
import { RefreshTokenService } from "@/auth/services/RefreshToken.service";
import { AccessTokenStrategy } from "@/auth/strategies/AccessToken.strategy";
import { UserModule } from "@/user/User.module";

@Module({
    imports: [
        ThrottlerModule.forRoot([{ ttl: 60 * 1000, limit: 10 }]), // TODO: Configure throttling
        PassportModule,
        UserModule,
        JwtModule,
        TypeOrmModule.forFeature([RefreshTokenEntity]),
    ],
    controllers: [AuthController],
    providers: [
        { provide: IAuthServiceToken, useClass: AuthService },
        { provide: IRefreshTokenServiceToken, useClass: RefreshTokenService },
        AccessTokenStrategy,
    ],
})
export class AuthModule {}
