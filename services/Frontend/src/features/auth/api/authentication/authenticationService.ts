import { AuthenticationResponseDto } from "@/features/auth/api/authentication/dto/AuthenticationResponseDto";
import { LoginRequestDto } from "@/features/auth/api/authentication/dto/LoginRequestDto";
import { RegisterRequestDto } from "@/features/auth/api/authentication/dto/RegisterRequestDto";
import { apiClient } from "@/lib/apiClient/apiClient";

const LOGIN_WITH_CREDENTIALS_ENDPOINT = "/auth/login";
const REGISTER_ENDPOINT = "/auth/register";
const LOGOUT_ENDPOINT = "/auth/logout";
const REFRESH_TOKEN_ENDPOINT = "/auth/refresh";

export class AuthenticationService {
    public static async loginWithCredentials(payload: LoginRequestDto): Promise<AuthenticationResponseDto> {
        const result = await apiClient.post<AuthenticationResponseDto>(LOGIN_WITH_CREDENTIALS_ENDPOINT, payload);
        return result.data;
    }

    public static async refreshSession(): Promise<AuthenticationResponseDto> {
        const result = await apiClient.post<AuthenticationResponseDto>(REFRESH_TOKEN_ENDPOINT);
        return result.data;
    }

    public static async register(payload: RegisterRequestDto) {
        await apiClient.post(REGISTER_ENDPOINT, payload);
    }

    public static async logout() {
        await apiClient.post(LOGOUT_ENDPOINT);
    }
}
