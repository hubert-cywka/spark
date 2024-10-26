import { PropsWithChildren } from "react";

import { useRefreshTokenInterceptor } from "@/features/auth/components/authRefreshProvider/hooks/useRefreshTokenInterceptor";
import { apiClient } from "@/lib/apiClient/apiClient";

type AuthRefreshProviderProps = PropsWithChildren;

export const AuthRefreshProvider = ({ children }: AuthRefreshProviderProps) => {
    useRefreshTokenInterceptor(apiClient);

    return <>{children}</>;
};
