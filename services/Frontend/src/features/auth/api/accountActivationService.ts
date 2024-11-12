import { ActivateAccountRequestPayload, RequestActivationTokenRequestPayload } from "@/features/auth/types/Authentication";
import { apiClient } from "@/lib/apiClient/apiClient";

const REQUEST_ACTIVATION_TOKEN_ENDPOINT = "/account/activation/request";
const ACTIVATE_ACCOUNT_ENDPOINT = "/account/activation/redeem";

export class AccountActivationService {
    public static async requestAccountActivationToken(payload: RequestActivationTokenRequestPayload) {
        await apiClient.post(REQUEST_ACTIVATION_TOKEN_ENDPOINT, payload);
    }

    public static async activateAccount(payload: ActivateAccountRequestPayload) {
        await apiClient.post(ACTIVATE_ACCOUNT_ENDPOINT, payload);
    }
}
