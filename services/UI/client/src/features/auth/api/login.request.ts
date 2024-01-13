import { User } from "@/features/auth/types/user";
import { apiClient } from "@/lib/apiClient/apiClient";

const LOGIN_ENDPOINT = "/api/login";

export type LoginRequestPayload = {
    email: string;
    password: string;
};

export type LoginRequestResponse = {
    user: User;
    token: string;
};

export const loginRequest = async (payload: LoginRequestPayload): Promise<LoginRequestResponse> => {
    const result = await apiClient.post<LoginRequestResponse>(LOGIN_ENDPOINT, payload);
    return result.data;
};
