import { useEffect } from "react";
import { AxiosInstance, HttpStatusCode } from "axios";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { logger } from "@/lib/logger/logger";

export const useAuthRefreshInterceptor = (client: AxiosInstance) => {
    useEffect(() => {
        const refreshTokenInterceptor = client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                const shouldReAuthenticate = error.response?.status === HttpStatusCode.Unauthorized && !originalRequest._retry;

                if (shouldReAuthenticate) {
                    originalRequest._retry = true;

                    try {
                        await AuthenticationService.refreshToken();
                        return client(originalRequest);
                    } catch (refreshError) {
                        logger.error({
                            msg: "Failed to refresh access token.",
                        });
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            client.interceptors.response.eject(refreshTokenInterceptor);
        };
    }, [client]);
};
