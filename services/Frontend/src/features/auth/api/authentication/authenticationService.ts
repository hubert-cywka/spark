import { AuthenticationResponseDto } from "@/features/auth/api/authentication/dto/AuthenticationResponseDto";
import { LoginRequestDto } from "@/features/auth/api/authentication/dto/LoginRequestDto";
import { RegisterRequestDto } from "@/features/auth/api/authentication/dto/RegisterRequestDto";
import { UpgradeAccessTokenDto } from "@/features/auth/api/authentication/dto/UpgradeAccessTokenDto.ts";
import { apiClient } from "@/lib/apiClient/apiClient";

export class AuthenticationService {
    public static async loginWithCredentials(payload: LoginRequestDto): Promise<AuthenticationResponseDto> {
        const result = await apiClient.post<AuthenticationResponseDto>("/auth/login", payload);
        return result.data;
    }

    public static async refreshSession(): Promise<AuthenticationResponseDto> {
        const result = await apiClient.post<AuthenticationResponseDto>("/auth/refresh");
        return result.data;
    }

    public static async register(payload: RegisterRequestDto) {
        await apiClient.post("/auth/register", payload);
    }

    public static async logout() {
        await apiClient.post("/auth/logout");
    }

    public static async upgradeSession(payload: UpgradeAccessTokenDto): Promise<AuthenticationResponseDto> {
        const result = await apiClient.post<AuthenticationResponseDto>("/scopes/activate", payload);
        return result.data;
    }
}
