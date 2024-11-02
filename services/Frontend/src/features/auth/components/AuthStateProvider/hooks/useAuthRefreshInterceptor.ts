import { useEffect, useRef } from "react";
import { AxiosInstance, HttpStatusCode } from "axios";

import { logger } from "@/lib/logger/logger";

export const useAuthRefreshInterceptor = (client: AxiosInstance, reAuthenticate: () => Promise<string>) => {
    const isInterceptorMountedRef = useRef<boolean | null>(null);

    useEffect(() => {
        if (isInterceptorMountedRef.current) {
            return;
        }

        const refreshTokenInterceptor = client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                const shouldReAuthenticate =
                    error.response?.status === HttpStatusCode.Unauthorized &&
                    !originalRequest._retry &&
                    !!originalRequest.headers.Authorization;

                if (shouldReAuthenticate) {
                    originalRequest._retry = true;

                    try {
                        const accessToken = await reAuthenticate();
                        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

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
        isInterceptorMountedRef.current = true;

        return () => {
            client.interceptors.response.eject(refreshTokenInterceptor);
            isInterceptorMountedRef.current = false;
        };
    }, [client, reAuthenticate]);
};
