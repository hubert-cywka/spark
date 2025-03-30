import { createContext } from "react";

export const TwoFactorAuthorizationContext = createContext({
    isAuthorizationInProgress: false,
    cancelAuthorizationProcess: () => {},
    startAuthorizationProcess: () => {},
});
