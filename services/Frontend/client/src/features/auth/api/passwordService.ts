import { RequestPasswordResetRequestPayload, UpdatePasswordResetRequestPayload } from "@/features/auth/types/authentication";
import { apiClient } from "@/lib/apiClient/apiClient";

const REQUEST_PASSWORD_RESET_ENDPOINT = "/auth/password/reset";
const UPDATE_PASSWORD_ENDPOINT = "/auth/password";

export class PasswordService {
    public static async requestPasswordResetLink(payload: RequestPasswordResetRequestPayload) {
        await apiClient.post(REQUEST_PASSWORD_RESET_ENDPOINT, payload);
    }

    public static async updatePassword(payload: UpdatePasswordResetRequestPayload) {
        await apiClient.put(UPDATE_PASSWORD_ENDPOINT, payload);
    }
}
