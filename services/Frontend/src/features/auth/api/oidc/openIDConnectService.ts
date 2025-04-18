import { AppRoute } from "@/app/appRoute";
import { AuthenticationResponseDto } from "@/features/auth/api/authentication/dto/AuthenticationResponseDto";
import { CreateAccountWithOIDCRequestDto } from "@/features/auth/api/oidc/dto/CreateAccountWithOIDCRequestDto";
import { apiClient } from "@/lib/apiClient/apiClient";
import { getAbsoluteAppUrl } from "@/utils/appUrl";

export class OpenIDConnectService {
    public static async register(payload: CreateAccountWithOIDCRequestDto) {
        const { data } = await apiClient.post<AuthenticationResponseDto>("/open-id-connect/register", payload);
        return data;
    }

    public static async login(provider: "google") {
        const url = `/open-id-connect/login/${provider}`;

        const { data } = await apiClient.get<{ url: string }>(
            `${url}?loginRedirectUrl=${getAbsoluteAppUrl(AppRoute.OIDC_LOGIN)}&registerRedirectUrl=${getAbsoluteAppUrl(AppRoute.OIDC_REGISTER)}`
        );
        return data;
    }
}
