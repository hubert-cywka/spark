import { RequestPasswordResetRequestDto } from "@/features/auth/api/password/dto/RequestPasswordResetRequestDto";
import { UpdatePasswordResetRequestDto } from "@/features/auth/api/password/dto/UpdatePasswordResetRequestDto";
import { apiClient } from "@/lib/apiClient/apiClient";

export class PasswordService {
    public static async requestPasswordResetLink(payload: RequestPasswordResetRequestDto) {
        await apiClient.post("/account/password/reset", payload);
    }

    public static async updatePassword(payload: UpdatePasswordResetRequestDto) {
        await apiClient.put("/account/password", payload);
    }
}
