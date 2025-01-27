import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import type { AccessTokenPayload } from "@/modules/identity/authentication/types/Authentication";
import { type User } from "@/types/User";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>("modules.identity.jwt.signingSecret"),
        });
    }

    validate({ account }: AccessTokenPayload): User {
        return account;
    }
}
