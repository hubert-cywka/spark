import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CURRENT_JWT_VERSION } from '@/auth/constants';
import { User } from '@/auth/interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    public async login(email: string, password: string) {
        const user = { email, password, name: 'Test' };
        const jwt = await this.generateJwt(user);
        return { user, jwt };
    }

    public async register(user: User) {
        const jwt = await this.generateJwt(user);
        return { user, jwt };
    }

    private async generateJwt(user: object) {
        const payload = { ...user, ver: CURRENT_JWT_VERSION };
        return this.jwtService.signAsync(payload);
    }
}
