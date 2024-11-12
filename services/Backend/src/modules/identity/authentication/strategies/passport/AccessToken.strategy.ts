import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import type { Account } from "@/modules/identity/account/models/Account.model";
import type { AccessTokenPayload } from "@/modules/identity/authentication/types/Authentication";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>("modules.auth.jwt.signingSecret"),
        });
    }

    validate({ account }: AccessTokenPayload): Account {
        return account;
    }
}
