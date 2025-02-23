import { useCallback, useEffect, useRef } from "react";
import { AxiosInstance, HttpStatusCode } from "axios";

import { useRefreshSession } from "@/features/auth/hooks";
import { logger } from "@/lib/logger/logger";

let refreshRequest: Promise<string> | null = null;

export const useAuthRefreshInterceptor = (client: AxiosInstance) => {
    const isInterceptorMountedRef = useRef<boolean>(false);
    const { mutateAsync: refreshSession } = useRefreshSession();

    const reAuthenticate = useCallback(async (): Promise<string> => {
        const { accessToken } = await refreshSession();
        return accessToken;
    }, [refreshSession]);

    useEffect(() => {
        if (isInterceptorMountedRef.current) {
            return;
        }

        const interceptor = client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                const isRefreshTokenRequest = error.request.url.includes("/auth/refresh");

                const shouldReAuthenticate =
                    error.response?.status === HttpStatusCode.Unauthorized &&
                    !!originalRequest.headers?.Authorization &&
                    !isRefreshTokenRequest;

                if (shouldReAuthenticate) {
                    if (!refreshRequest) {
                        refreshRequest = reAuthenticate();
                    }

                    try {
                        const accessToken = await refreshRequest;
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        refreshRequest = null;

                        return await client(originalRequest);
                    } catch (refreshError) {
                        refreshRequest = null;
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
            client.interceptors.response.eject(interceptor);
            isInterceptorMountedRef.current = false;
        };
    }, [client, reAuthenticate]);
};
