import { AuthenticationResponseDto } from "@/features/auth/api/authentication/dto/AuthenticationResponseDto";
import { CreateAccountWithOIDCRequestDto } from "@/features/auth/api/oidc/dto/CreateAccountWithOIDCRequestDto";
import { apiClient } from "@/lib/apiClient/apiClient";

const CREATE_ACCOUNT_WITH_OIDC_ENDPOINT = "/open-id-connect/register";
const LOGIN_WITH_OIDC_ENDPOINT_BASE = "/open-id-connect/login";

export class OpenIDConnectService {
    public static async register(payload: CreateAccountWithOIDCRequestDto) {
        const result = await apiClient.post<AuthenticationResponseDto>(CREATE_ACCOUNT_WITH_OIDC_ENDPOINT, payload);
        return result.data;
    }

    public static async login(provider: "google") {
        const response = await apiClient.get<{ url: string }>(`${LOGIN_WITH_OIDC_ENDPOINT_BASE}/${provider}`);
        return response.data;
    }
}
