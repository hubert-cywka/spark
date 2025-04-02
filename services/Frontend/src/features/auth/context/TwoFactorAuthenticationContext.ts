import { createContext } from "react";

import { AccessScope } from "@/features/auth/types/Identity";

export const TwoFactorAuthenticationContext = createContext<{
    isAuthenticationInProgress: boolean;
    cancelAuthenticationProcess: () => void;
    startAuthenticationProcess: (scopes: AccessScope[]) => void;
}>({
    isAuthenticationInProgress: false,
    cancelAuthenticationProcess: () => {},
    startAuthenticationProcess: (_scopes: AccessScope[]) => {},
});
