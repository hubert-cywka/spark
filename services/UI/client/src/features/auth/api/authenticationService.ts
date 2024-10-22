import {
    LoginRequestPayload,
    LoginRequestResponse,
    RefreshTokenRequestResponse,
    RegisterRequestPayload,
} from "@/features/auth/types/authentication";
import { apiClient } from "@/lib/apiClient/apiClient";

const LOGIN_ENDPOINT = "/auth/login";
const REGISTER_ENDPOINT = "/auth/register";
const LOGOUT_ENDPOINT = "/auth/logout";
const REFRESH_TOKEN_ENDPOINT = "/auth/refresh";

export class AuthenticationService {
    public static async login(payload: LoginRequestPayload) {
        const result = await apiClient.post<LoginRequestResponse>(LOGIN_ENDPOINT, payload);
        return result.data;
    }

    public static async register(payload: RegisterRequestPayload) {
        await apiClient.post(REGISTER_ENDPOINT, payload);
    }

    public static async logout() {
        await apiClient.post<LoginRequestResponse>(LOGOUT_ENDPOINT);
    }

    public static async refreshToken() {
        const result = await apiClient.post<RefreshTokenRequestResponse>(REFRESH_TOKEN_ENDPOINT);
        return result.data;
    }
}
