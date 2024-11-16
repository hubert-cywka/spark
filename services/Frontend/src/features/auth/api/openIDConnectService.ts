import { AuthenticationResponse } from "@/features/auth/types/Authentication";
import { CreateAccountWithOIDCRequestPayload } from "@/features/auth/types/OpenIDConnect";
import { apiClient } from "@/lib/apiClient/apiClient";

const CREATE_ACCOUNT_WITH_OIDC_ENDPOINT = "/open-id-connect/register";
const LOGIN_WITH_OIDC_ENDPOINT_BASE = "/open-id-connect/login";

export class OpenIDConnectService {
    public static async register(payload: CreateAccountWithOIDCRequestPayload) {
        const result = await apiClient.post<AuthenticationResponse>(CREATE_ACCOUNT_WITH_OIDC_ENDPOINT, payload);
        return result.data;
    }

    public static async login(provider: "google") {
        const response = await apiClient.get<{ url: string }>(`${LOGIN_WITH_OIDC_ENDPOINT_BASE}/${provider}`);
        return response.data;
    }
}
