"use client";

import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthStateProvider } from "@/features/auth/components/AuthStateProvider/AuthStateProvider";

type ProviderProps = PropsWithChildren;

export const Provider = ({ children }: ProviderProps) => {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthStateProvider>
                {children}
                <Toaster position="bottom-right" />
            </AuthStateProvider>
        </QueryClientProvider>
    );
};
