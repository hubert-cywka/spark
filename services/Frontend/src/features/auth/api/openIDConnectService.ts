import { AuthenticationResponse } from "@/features/auth/types/Authentication";
import { CreateAccountWithOIDCRequestPayload } from "@/features/auth/types/OpenIDConnect";
import { apiClient } from "@/lib/apiClient/apiClient";

const CREATE_ACCOUNT_WITH_OIDC_ENDPOINT = "/open-id-connect/register";

export class OpenIDConnectService {
    public static async register(payload: CreateAccountWithOIDCRequestPayload) {
        const result = await apiClient.post<AuthenticationResponse>(CREATE_ACCOUNT_WITH_OIDC_ENDPOINT, payload);
        return result.data;
    }
}
