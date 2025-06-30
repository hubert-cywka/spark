import { AppRoute } from "@/app/appRoute";
import { AuthenticationResponseDto } from "@/features/auth/api/authentication/dto/AuthenticationResponseDto";
import { CreateAccountWithOIDCRequestDto } from "@/features/auth/api/oidc/dto/CreateAccountWithOIDCRequestDto";
import { apiClient } from "@/lib/apiClient/apiClient";
import { getAbsoluteAppUrl } from "@/utils/urlUtils";

export class OpenIDConnectService {
    public static async register(payload: CreateAccountWithOIDCRequestDto) {
        const { data } = await apiClient.post<AuthenticationResponseDto>("/open-id-connect/register", payload);
        return data;
    }

    public static async login(provider: "google") {
        const url = `/open-id-connect/login/${provider}?`
            .concat(`loginRedirectUrl=${getAbsoluteAppUrl(AppRoute.OIDC_LOGIN)}`)
            .concat(`&registerRedirectUrl=${getAbsoluteAppUrl(AppRoute.OIDC_REGISTER)}`);

        const { data } = await apiClient.get<{ url: string }>(url);
        return data;
    }
}
