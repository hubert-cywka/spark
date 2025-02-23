"use client";

import { PropsWithChildren } from "react";

import { useAuthHeaderInterceptor } from "@/features/auth/components/AuthStateProvider/hooks/useAuthHeaderInterceptor";
import { useAuthRefreshInterceptor } from "@/features/auth/components/AuthStateProvider/hooks/useAuthRefreshInterceptor";
import { apiClient } from "@/lib/apiClient/apiClient";

export const AuthSessionProvider = ({ children }: PropsWithChildren) => {
    useAuthRefreshInterceptor(apiClient);
    useAuthHeaderInterceptor(apiClient);

    return <>{children}</>;
};
