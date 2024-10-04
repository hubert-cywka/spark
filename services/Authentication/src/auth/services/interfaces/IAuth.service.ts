import { LoginDto } from "@/auth/dto/Login.dto";
import { RegisterDto } from "@/auth/dto/Register.dto";
import { AuthenticationResult } from "@/auth/types/authenticationResult";

export const IAuthServiceToken = Symbol("IAuthService");

export interface IAuthService {
    login(loginDto: LoginDto): Promise<AuthenticationResult>;
    redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult>;
    logout(refreshToken: string): Promise<void>;
    register(registerDto: RegisterDto): Promise<void>;
}
