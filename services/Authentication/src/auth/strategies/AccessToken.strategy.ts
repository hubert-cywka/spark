import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AccessTokenPayload } from "@/auth/types/accessTokenPayload";
import { User } from "@/user/models/User.model";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>("jwt.signingSecret"),
        });
    }

    validate({ email, id }: AccessTokenPayload): User {
        return { email, id };
    }
}
