import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { plainToInstance } from "class-transformer";

import { CURRENT_JWT_VERSION } from "@/auth/constants";
import { AuthenticationResponseDto } from "@/auth/dto/AuthenticationResponse.dto";
import { User } from "@/user/models/User.model";
import { IUserService, IUserServiceToken } from "@/user/services/IUser.service";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject(IUserServiceToken)
        private userService: IUserService
    ) {}

    public async login(email: string, password: string): Promise<AuthenticationResponseDto> {
        const user = await this.userService.findByCredentials(email, password);
        const token = await this.generateAuthToken(user);

        return this.mapToAuthenticationResponse(user, token);
    }

    public async register(email: string, password: string): Promise<AuthenticationResponseDto> {
        const user = await this.userService.save(email, password);
        const token = await this.generateAuthToken(user);

        return this.mapToAuthenticationResponse(user, token);
    }

    private async generateAuthToken(user: User) {
        const payload = { ...user, ver: CURRENT_JWT_VERSION };
        return this.jwtService.signAsync(payload);
    }

    private mapToAuthenticationResponse(user: User, token: string): AuthenticationResponseDto {
        return plainToInstance(AuthenticationResponseDto, { user, token });
    }
}
