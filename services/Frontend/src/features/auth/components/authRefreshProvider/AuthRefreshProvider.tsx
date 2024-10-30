import { PropsWithChildren } from "react";

import { useAuthRefreshInterceptor } from "@/features/auth/components/authRefreshProvider/hooks/useAuthRefreshInterceptor";
import { apiClient } from "@/lib/apiClient/apiClient";

export const AuthRefreshProvider = ({ children }: PropsWithChildren) => {
    useAuthRefreshInterceptor(apiClient);

    return <>{children}</>;
};
