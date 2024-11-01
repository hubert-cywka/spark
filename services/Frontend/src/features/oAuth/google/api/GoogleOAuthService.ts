import { apiClient } from "@/lib/apiClient/apiClient";

const LOGIN_WITH_GOOGLE_ENDPOINT = "/oauth/google/login";

export class GoogleOAuthService {
    public static async login() {
        await apiClient.post(LOGIN_WITH_GOOGLE_ENDPOINT);
    }
}
