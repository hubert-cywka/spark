import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from "@/modules/auth/models/User.model";
import { AccessTokenPayload } from "@/modules/auth/types/accessTokenPayload";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>("modules.auth.jwt.signingSecret"),
        });
    }

    validate({ email, id }: AccessTokenPayload): User {
        return { email, id };
    }
}
