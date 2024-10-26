import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Account } from "@/modules/identity/account/models/Account.model";
import { AccessTokenPayload } from "@/modules/identity/authentication/types/accessTokenPayload";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>("modules.auth.jwt.signingSecret"),
        });
    }

    validate({ email, id }: AccessTokenPayload): Account {
        return { email, id };
    }
}
