"use client";

import React, { PropsWithChildren } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthSessionProvider } from "@/features/auth/components/AuthStateProvider/AuthSessionProvider";

type ProviderProps = PropsWithChildren;

const SKELETON_BASE_COLOR = "#202020";
const SKELETON_HIGHLIGHT_COLOR = "#444";

export const Provider = ({ children }: ProviderProps) => {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <SkeletonTheme baseColor={SKELETON_BASE_COLOR} highlightColor={SKELETON_HIGHLIGHT_COLOR}>
            <QueryClientProvider client={queryClient}>
                <Toaster position="top-right" />
                <AuthSessionProvider>{children}</AuthSessionProvider>
            </QueryClientProvider>
        </SkeletonTheme>
    );
};
