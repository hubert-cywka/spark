import { RequestPasswordResetRequestDto } from "@/features/auth/api/password/dto/RequestPasswordResetRequestDto";
import { UpdatePasswordResetRequestDto } from "@/features/auth/api/password/dto/UpdatePasswordResetRequestDto";
import { apiClient } from "@/lib/apiClient/apiClient";

const REQUEST_PASSWORD_RESET_ENDPOINT = "/account/password/reset";
const UPDATE_PASSWORD_ENDPOINT = "/account/password";

export class PasswordService {
    public static async requestPasswordResetLink(payload: RequestPasswordResetRequestDto) {
        await apiClient.post(REQUEST_PASSWORD_RESET_ENDPOINT, payload);
    }

    public static async updatePassword(payload: UpdatePasswordResetRequestDto) {
        await apiClient.put(UPDATE_PASSWORD_ENDPOINT, payload);
    }
}
