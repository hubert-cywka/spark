"use client";

import { PropsWithChildren, useCallback, useEffect } from "react";

import { Overlay } from "@/components/Overlay";
import { Spinner } from "@/components/Spinner";
import { useAuthRefreshInterceptor } from "@/features/auth/components/AuthStateProvider/hooks/useAuthRefreshInterceptor";
import { useAuthStore, useRefreshSession, useRefreshSessionEvents } from "@/features/auth/hooks";
import { apiClient } from "@/lib/apiClient/apiClient";
import { logger } from "@/lib/logger/logger";

export const AuthStateProvider = ({ children }: PropsWithChildren) => {
    const { onRefreshSuccess } = useRefreshSessionEvents();
    const { mutateAsync: refreshSession, isPending } = useRefreshSession();

    const accessToken = useAuthStore().accessToken;
    const storeAccessToken = useAuthStore().storeAccessToken;
    const storeIdentity = useAuthStore().storeIdentity;

    const reAuthenticate = useCallback(async (): Promise<string> => {
        const { accessToken, id, email } = await refreshSession();
        storeIdentity({ id, email });
        storeAccessToken(accessToken);
        return accessToken;
    }, [refreshSession, storeAccessToken, storeIdentity]);

    const restoreSession = useCallback(async (): Promise<void> => {
        try {
            await reAuthenticate();
            onRefreshSuccess();
        } catch (err) {
            logger.warn({ err, msg: "Failed to restore session." });
        }
    }, [onRefreshSuccess, reAuthenticate]);

    useEffect(() => {
        if (!accessToken) {
            void restoreSession();
        }
    }, [accessToken, restoreSession]);

    useAuthRefreshInterceptor(apiClient, reAuthenticate);

    if (isPending) {
        return (
            <Overlay>
                <Spinner size="3" />
            </Overlay>
        );
    }

    return <>{children}</>;
};
