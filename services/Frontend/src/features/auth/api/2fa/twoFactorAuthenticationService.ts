import { Confirm2FAMethodDto } from "@/features/auth/api/2fa/dto/Confirm2FAMethodDto.ts";
import { EnableAuthenticatorAppMethodDto } from "@/features/auth/api/2fa/dto/EnableAuthenticatorAppMethodDto.ts";
import { TwoFactorAuthenticationOptionDto } from "@/features/auth/api/2fa/dto/TwoFactorAuthenticationOptionDto.ts";
import { TwoFactorAuthenticationMethod, TwoFactorAuthenticationOption } from "@/features/auth/types/TwoFactorAuthentication";
import { apiClient } from "@/lib/apiClient/apiClient";

export class TwoFactorAuthenticationService {
    public static async getEnabledMethods(): Promise<TwoFactorAuthenticationOption[]> {
        const result = await apiClient.get<TwoFactorAuthenticationOptionDto[]>("2fa/method");
        return result.data.map(TwoFactorAuthenticationService.mapDtoToOption);
    }

    public static async enableAuthenticatorAppMethod(): Promise<string> {
        const result = await apiClient.post<EnableAuthenticatorAppMethodDto>("2fa/method/app/enable");
        return result.data.url;
    }

    public static async enableEmailMethod(): Promise<void> {
        await apiClient.post("2fa/method/email/enable");
    }

    public static async disableMethod(method: TwoFactorAuthenticationMethod): Promise<void> {
        await apiClient.post(`2fa/method/${method}/disable`);
    }

    public static async confirmMethod({ method, code }: Confirm2FAMethodDto): Promise<void> {
        await apiClient.post(`2fa/method/${method}/verify`, { code });
    }

    public static async requestCode(method: TwoFactorAuthenticationMethod): Promise<void> {
        await apiClient.post(`2fa/method/${method}/issue`);
    }

    private static mapDtoToOption(dto: TwoFactorAuthenticationOptionDto): TwoFactorAuthenticationOption {
        return {
            method: dto.method,
            enabledAt: new Date(dto.enabledAt),
        };
    }
}
