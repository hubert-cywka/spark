import { ActivateAccountRequestDto } from "@/features/auth/api/account/dto/ActivateAccountRequestDto";
import { RequestActivationTokenRequestDto } from "@/features/auth/api/account/dto/RequestActivationTokenRequestDto";
import { apiClient } from "@/lib/apiClient/apiClient";

export class AccountActivationService {
    public static async requestAccountActivationToken(payload: RequestActivationTokenRequestDto) {
        await apiClient.post("/account/activation/request", payload);
    }

    public static async activateAccount(payload: ActivateAccountRequestDto) {
        await apiClient.post("/account/activation/redeem", payload);
    }
}
