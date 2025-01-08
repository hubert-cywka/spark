"use client";

import { PropsWithChildren, useCallback, useEffect } from "react";

import { useAuthHeaderInterceptor } from "@/features/auth/components/AuthStateProvider/hooks/useAuthHeaderInterceptor";
import { useAuthRefreshInterceptor } from "@/features/auth/components/AuthStateProvider/hooks/useAuthRefreshInterceptor";
import { useAuthSession, useRefreshSession, useRefreshSessionEvents } from "@/features/auth/hooks";
import { apiClient } from "@/lib/apiClient/apiClient";
import { logger } from "@/lib/logger/logger";

export const AuthSessionProvider = ({ children }: PropsWithChildren) => {
    const { onRefreshSuccess } = useRefreshSessionEvents();
    const { mutateAsync: refreshSession } = useRefreshSession();
    const accessToken = useAuthSession((state) => state.accessToken);

    const reAuthenticate = useCallback(async (): Promise<string> => {
        const { accessToken } = await refreshSession();
        return accessToken;
    }, [refreshSession]);

    const restoreSession = useCallback(async (): Promise<void> => {
        try {
            await reAuthenticate();
            onRefreshSuccess();
        } catch (err) {
            logger.warn({ err, msg: "Failed to restore session." });
        }
    }, [onRefreshSuccess, reAuthenticate]);

    useEffect(() => {
        if (accessToken) {
            return;
        }

        // TODO: This is a workaround to prevent refreshing the session during OIDC flow. It's okay for now, but it should be fixed anyway.
        const timeout = setTimeout(restoreSession, 1000);
        return () => clearTimeout(timeout);
    }, [accessToken, restoreSession]);

    useAuthRefreshInterceptor(apiClient, reAuthenticate);
    useAuthHeaderInterceptor(apiClient);

    return <>{children}</>;
};
