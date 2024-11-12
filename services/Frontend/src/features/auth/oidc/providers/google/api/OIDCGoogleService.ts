import { apiClient } from "@/lib/apiClient/apiClient";

const LOGIN_WITH_GOOGLE_ENDPOINT = "/open-id-connect/login/google";

export class OIDCGoogleService {
    public static async login() {
        const response = await apiClient.get<{ url: string }>(LOGIN_WITH_GOOGLE_ENDPOINT);
        return response.data;
    }
}
