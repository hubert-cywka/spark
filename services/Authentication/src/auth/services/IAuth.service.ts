import { AuthenticationResponseDto } from "@/auth/dto/AuthenticationResponse.dto";

export const IAuthServiceToken = Symbol("IAuthService");

export interface IAuthService {
    login(email: string, password: string): Promise<AuthenticationResponseDto>;
    register(email: string, password: string): Promise<AuthenticationResponseDto>;
}
