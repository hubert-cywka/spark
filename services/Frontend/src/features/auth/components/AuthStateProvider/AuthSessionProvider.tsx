"use client";

import { PropsWithChildren, useCallback } from "react";

import { useAuthHeaderInterceptor } from "@/features/auth/components/AuthStateProvider/hooks/useAuthHeaderInterceptor";
import { useAuthRefreshInterceptor } from "@/features/auth/components/AuthStateProvider/hooks/useAuthRefreshInterceptor";
import { useRefreshSession } from "@/features/auth/hooks";
import { apiClient } from "@/lib/apiClient/apiClient";

export const AuthSessionProvider = ({ children }: PropsWithChildren) => {
    const { mutateAsync: refreshSession } = useRefreshSession();

    const reAuthenticate = useCallback(async (): Promise<string> => {
        const { accessToken } = await refreshSession();
        return accessToken;
    }, [refreshSession]);

    useAuthRefreshInterceptor(apiClient, reAuthenticate);
    useAuthHeaderInterceptor(apiClient);

    return <>{children}</>;
};
