import { LoginDto } from "@/modules/auth/dto/Login.dto";
import { RegisterDto } from "@/modules/auth/dto/Register.dto";
import { AuthenticationResult } from "@/modules/auth/types/authenticationResult";

export const IAuthServiceToken = Symbol("IAuthService");

export interface IAuthService {
    login(loginDto: LoginDto): Promise<AuthenticationResult>;
    redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult>;
    logout(refreshToken: string): Promise<void>;
    register(registerDto: RegisterDto): Promise<void>;
}
