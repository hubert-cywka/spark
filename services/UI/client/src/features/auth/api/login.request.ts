import { apiClient } from "@/lib/apiClient/apiClient";

const LOGIN_ENDPOINT = "/auth/login";

export type LoginRequestPayload = {
    email: string;
    password: string;
};

export type LoginRequestResponse = {
    token: string;
};

export const loginRequest = async (payload: LoginRequestPayload): Promise<LoginRequestResponse> => {
    const result = await apiClient.post<LoginRequestResponse>(LOGIN_ENDPOINT, payload);
    return result.data;
};
