import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('jwt.signingSecret'),
                signOptions: {
                    expiresIn: configService.get('jwt.expirationTimeInSeconds'),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
