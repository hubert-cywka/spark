import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";

import { queryClient } from "@/lib/queryClient/queryClient";
import { mainTheme } from "@/styles/mainTheme";

type ProviderProps = PropsWithChildren;

export const Provider = ({ children }: ProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={mainTheme}>{children}</ThemeProvider>
        </QueryClientProvider>
    );
};
