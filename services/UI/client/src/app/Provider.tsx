import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient/queryClient";

type ProviderProps = PropsWithChildren;

export const Provider = ({ children }: ProviderProps) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
