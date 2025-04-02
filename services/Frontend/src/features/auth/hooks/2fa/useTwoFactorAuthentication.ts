import { useContext } from "react";

import { TwoFactorAuthenticationContext } from "@/features/auth/context";

export const useTwoFactorAuthentication = () => {
    return useContext(TwoFactorAuthenticationContext);
};
