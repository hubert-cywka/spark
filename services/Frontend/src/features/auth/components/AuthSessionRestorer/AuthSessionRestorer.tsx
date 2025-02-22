"use client";

import { PropsWithChildren, useCallback, useEffect } from "react";

import { LoadingOverlay } from "@/components/LoadingOverlay/LoadingOverlay";
import { useAuthSession, useRefreshSession, useRefreshSessionEvents } from "@/features/auth/hooks";
import { logger } from "@/lib/logger/logger";

export const AuthSessionRestorer = ({ children }: PropsWithChildren) => {
    const { onRefreshSuccess } = useRefreshSessionEvents();
    const { mutateAsync: refreshSession, isError, isSuccess } = useRefreshSession();
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

        void restoreSession();
    }, [accessToken, restoreSession]);

    if (!accessToken && !isError && !isSuccess) {
        return <LoadingOverlay />;
    }

    return <>{children}</>;
};
