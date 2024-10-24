import { useEffect } from "react";
import { AxiosInstance, HttpStatusCode } from "axios";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { useAuthToken } from "@/features/auth/hooks/useAuthToken";
import { logger } from "@/lib/logger/logger";

export const useRefreshTokenInterceptor = (client: AxiosInstance) => {
    const setAuthToken = useAuthToken().setToken;

    useEffect(() => {
        const refreshTokenInterceptor = client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const { accessToken } = await AuthenticationService.refreshToken();
                        setAuthToken(accessToken);
                        return client(originalRequest);
                    } catch (refreshError) {
                        logger.error({
                            msg: "Failed to refresh access token.",
                        });
                    }
                }
            }
        );

        return () => {
            client.interceptors.response.eject(refreshTokenInterceptor);
        };
    }, [client, setAuthToken]);
};
