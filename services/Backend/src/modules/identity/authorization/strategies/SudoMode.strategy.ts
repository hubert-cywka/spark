import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import type { AccessTokenPayload } from "@/modules/identity/authentication/types/Authentication";
import { type User } from "@/types/User";

@Injectable()
export class SudoModeStrategy extends PassportStrategy(Strategy, "sudo") {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>("modules.identity.jwt.signingSecret"),
        });
    }

    validate({ account }: AccessTokenPayload): User {
        if (!account.sudoMode) {
            throw new UnauthorizedException();
        }

        return account;
    }
}
