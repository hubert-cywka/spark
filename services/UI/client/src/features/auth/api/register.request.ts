import { User } from "@/features/auth/types/user";
import { apiClient } from "@/lib/apiClient/apiClient";

const REGISTER_ENDPOINT = "/api/register";

export type RegisterRequestPayload = {
    email: string;
    password: string;
    displayName: string;
};

export type RegisterRequestResponse = {
    user: User;
    token: string;
};

export const registerRequest = async (payload: RegisterRequestPayload): Promise<RegisterRequestResponse> => {
    const result = await apiClient.post<RegisterRequestResponse>(REGISTER_ENDPOINT, payload);
    return result.data;
};
