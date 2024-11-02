import { apiClient } from "@/lib/apiClient/apiClient";

const LOGIN_WITH_GOOGLE_ENDPOINT = "/oidc/google/login";

export class GoogleAuthService {
    public static async login() {
        await apiClient.post(LOGIN_WITH_GOOGLE_ENDPOINT);
    }
}
