import { AuthenticationResponse, LoginRequestPayload, RegisterRequestPayload } from "@/features/auth/types/authentication";
import { apiClient } from "@/lib/apiClient/apiClient";

const LOGIN_WITH_CREDENTIALS_ENDPOINT = "/auth/login";
const REGISTER_ENDPOINT = "/auth/register";
const LOGOUT_ENDPOINT = "/auth/logout";
const REFRESH_TOKEN_ENDPOINT = "/auth/refresh";

export class AuthenticationService {
    public static async loginWithCredentials(payload: LoginRequestPayload): Promise<AuthenticationResponse> {
        const result = await apiClient.post<AuthenticationResponse>(LOGIN_WITH_CREDENTIALS_ENDPOINT, payload);
        return result.data;
    }

    public static async refreshSession(): Promise<AuthenticationResponse> {
        const result = await apiClient.post<AuthenticationResponse>(REFRESH_TOKEN_ENDPOINT);
        return result.data;
    }

    public static async register(payload: RegisterRequestPayload) {
        await apiClient.post(REGISTER_ENDPOINT, payload);
    }

    public static async logout() {
        await apiClient.post(LOGOUT_ENDPOINT);
    }
}
