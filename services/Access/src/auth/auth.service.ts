import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { CURRENT_JWT_VERSION } from "@/auth/constants";
import { TokenPayload } from "@/auth/interfaces/token-payload.interface";
import { User } from "@/auth/interfaces/user.interface";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    public async login(email: string, password: string) {
        const user = { email, password, name: email };
        const token = await this.generateAuthToken(user);
        return { user, token };
    }

    public async register(user: User) {
        const token = await this.generateAuthToken(user);
        return { user, token };
    }

    private async generateAuthToken(user: User) {
        const payload: TokenPayload = { ...user, ver: CURRENT_JWT_VERSION };
        return this.jwtService.signAsync(payload);
    }
}
