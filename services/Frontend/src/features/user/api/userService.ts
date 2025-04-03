import { apiClient } from "@/lib/apiClient/apiClient";

export class UserService {
    public static async terminateAccount() {
        await apiClient.delete("/user/myself");
    }
}
