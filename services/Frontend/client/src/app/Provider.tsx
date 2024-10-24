import { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "styled-components";

import { AuthRefreshProvider } from "@/features/auth/components/authRefreshProvider/AuthRefreshProvider";
import { i18n } from "@/lib/i18n/i18n";
import { queryClient } from "@/lib/queryClient/queryClient";
import { mainTheme } from "@/styles/mainTheme";

type ProviderProps = PropsWithChildren;

export const Provider = ({ children }: ProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthRefreshProvider>
                <ThemeProvider theme={mainTheme}>
                    <I18nextProvider i18n={i18n}>
                        {children}
                        <Toaster position="bottom-left" />
                    </I18nextProvider>
                </ThemeProvider>
            </AuthRefreshProvider>
        </QueryClientProvider>
    );
};
