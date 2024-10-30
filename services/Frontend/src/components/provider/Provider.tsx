"use client";

import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthRefreshProvider } from "@/features/auth/components/authRefreshProvider/AuthRefreshProvider";

type ProviderProps = PropsWithChildren;

export const Provider = ({ children }: ProviderProps) => {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthRefreshProvider>
                {children}
                <Toaster position="bottom-left" />
            </AuthRefreshProvider>
        </QueryClientProvider>
    );
};
