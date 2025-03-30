import { createContext } from "react";

export const TwoFactorAuthenticationContext = createContext({
    isAuthorizationInProgress: false,
    cancelAuthorizationProcess: () => {},
    startAuthorizationProcess: () => {},
});
