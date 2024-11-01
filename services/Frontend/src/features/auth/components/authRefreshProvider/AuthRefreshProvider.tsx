import { PropsWithChildren } from "react";

import { useAuthRefreshInterceptor } from "@/features/auth/components/AuthRefreshProvider/hooks/useAuthRefreshInterceptor";
import { apiClient } from "@/lib/apiClient/apiClient";

export const AuthRefreshProvider = ({ children }: PropsWithChildren) => {
    useAuthRefreshInterceptor(apiClient);

    return <>{children}</>;
};
