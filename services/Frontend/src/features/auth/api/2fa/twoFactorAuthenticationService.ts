import { ConfirmTwoFactorAuthenticationIntegrationDto } from "@/features/auth/api/2fa/dto/ConfirmTwoFactorAuthenticationIntegrationDto.ts";
import { EnableAuthenticatorAppIntegrationDto } from "@/features/auth/api/2fa/dto/EnableAuthenticatorAppIntegrationDto.ts";
import { TwoFactorAuthenticationIntegrationDto } from "@/features/auth/api/2fa/dto/TwoFactorAuthenticationIntegrationDto.ts";
import { TwoFactorAuthenticationIntegration, TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";
import { apiClient } from "@/lib/apiClient/apiClient";

export class TwoFactorAuthenticationService {
    public static async getActiveIntegrations(): Promise<TwoFactorAuthenticationIntegration[]> {
        const result = await apiClient.get<TwoFactorAuthenticationIntegrationDto[]>("2fa/method");
        return result.data.map(TwoFactorAuthenticationService.mapDtoToIntegration);
    }

    public static async enableAppIntegration(): Promise<string> {
        const result = await apiClient.post<EnableAuthenticatorAppIntegrationDto>("2fa/method/app/enable");
        return result.data.url;
    }

    public static async enableEmailIntegration(): Promise<void> {
        await apiClient.post("2fa/method/email/enable");
    }

    public static async disableIntegration(method: TwoFactorAuthenticationMethod): Promise<void> {
        await apiClient.post(`2fa/method/${method}/disable`);
    }

    public static async confirmIntegration({ method, code }: ConfirmTwoFactorAuthenticationIntegrationDto): Promise<void> {
        await apiClient.post(`2fa/method/${method}/verify`, { code });
    }

    public static async requestCode(method: TwoFactorAuthenticationMethod): Promise<void> {
        await apiClient.post(`2fa/method/${method}/issue`);
    }

    private static mapDtoToIntegration(dto: TwoFactorAuthenticationIntegrationDto): TwoFactorAuthenticationIntegration {
        return {
            method: dto.method,
            enabledAt: new Date(dto.enabledAt),
        };
    }
}
