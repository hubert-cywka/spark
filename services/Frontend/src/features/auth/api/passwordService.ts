import { RequestPasswordResetRequestPayload, UpdatePasswordResetRequestPayload } from "@/features/auth/types/Authentication";
import { apiClient } from "@/lib/apiClient/apiClient";

const REQUEST_PASSWORD_RESET_ENDPOINT = "/account/password/reset";
const UPDATE_PASSWORD_ENDPOINT = "/account/password";

export class PasswordService {
    public static async requestPasswordResetLink(payload: RequestPasswordResetRequestPayload) {
        await apiClient.post(REQUEST_PASSWORD_RESET_ENDPOINT, payload);
    }

    public static async updatePassword(payload: UpdatePasswordResetRequestPayload) {
        await apiClient.put(UPDATE_PASSWORD_ENDPOINT, payload);
    }
}
