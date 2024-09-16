import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./Auth.controller";

import { AuthService } from "@/auth/services/Auth.service";
import { IAuthServiceToken } from "@/auth/services/IAuth.service";
import { UserModule } from "@/user/User.module";

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get("jwt.signingSecret"),
                signOptions: {
                    expiresIn: configService.get("jwt.expirationTimeInSeconds"),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [{ provide: IAuthServiceToken, useClass: AuthService }],
})
export class AuthModule {}
