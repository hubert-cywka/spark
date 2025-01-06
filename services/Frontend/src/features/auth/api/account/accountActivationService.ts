import { ActivateAccountRequestDto } from "@/features/auth/api/account/dto/ActivateAccountRequestDto";
import { RequestActivationTokenRequestDto } from "@/features/auth/api/account/dto/RequestActivationTokenRequestDto";
import { apiClient } from "@/lib/apiClient/apiClient";

const REQUEST_ACTIVATION_TOKEN_ENDPOINT = "/account/activation/request";
const ACTIVATE_ACCOUNT_ENDPOINT = "/account/activation/redeem";

export class AccountActivationService {
    public static async requestAccountActivationToken(payload: RequestActivationTokenRequestDto) {
        await apiClient.post(REQUEST_ACTIVATION_TOKEN_ENDPOINT, payload);
    }

    public static async activateAccount(payload: ActivateAccountRequestDto) {
        await apiClient.post(ACTIVATE_ACCOUNT_ENDPOINT, payload);
    }
}
