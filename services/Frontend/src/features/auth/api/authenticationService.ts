import { LoginRequestPayload, RegisterRequestPayload } from "@/features/auth/types/authentication";
import { apiClient } from "@/lib/apiClient/apiClient";

const LOGIN_WITH_CREDENTIALS_ENDPOINT = "/auth/login";
const REGISTER_ENDPOINT = "/auth/register";
const LOGOUT_ENDPOINT = "/auth/logout";
const REFRESH_TOKEN_ENDPOINT = "/auth/refresh";

export class AuthenticationService {
    public static async loginWithCredentials(payload: LoginRequestPayload) {
        await apiClient.post(LOGIN_WITH_CREDENTIALS_ENDPOINT, payload);
    }

    public static async register(payload: RegisterRequestPayload) {
        await apiClient.post(REGISTER_ENDPOINT, payload);
    }

    public static async logout() {
        await apiClient.post(LOGOUT_ENDPOINT);
    }

    public static async refreshToken() {
        await apiClient.post(REFRESH_TOKEN_ENDPOINT);
    }
}
