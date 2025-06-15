"use client";

import { PropsWithChildren, useCallback, useEffect } from "react";

import { LoadingOverlay } from "@/components/LoadingOverlay/LoadingOverlay";
import { useAuthSession, useRefreshSession, useRefreshSessionEvents } from "@/features/auth/hooks";
import { logger } from "@/lib/logger/logger";

type AuthSessionRestorerProps = PropsWithChildren<{
    inBackground?: boolean;
}>;

export const AuthSessionRestorer = ({ children, inBackground }: AuthSessionRestorerProps) => {
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

            if (!inBackground) {
                onRefreshSuccess();
            }
        } catch (err) {
            logger.warn({ err, msg: "Failed to restore session." });
        }
    }, [inBackground, onRefreshSuccess, reAuthenticate]);

    useEffect(() => {
        if (accessToken) {
            return;
        }

        void restoreSession();
    }, [accessToken, restoreSession]);

    if (!accessToken && !isError && !isSuccess && !inBackground) {
        return <LoadingOverlay />;
    }

    return <>{children}</>;
};
