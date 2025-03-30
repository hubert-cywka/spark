import { useContext } from "react";

import { TwoFactorAuthorizationContext } from "@/features/auth/context";

export const useTwoFactorAuthorization = () => {
    return useContext(TwoFactorAuthorizationContext);
};
