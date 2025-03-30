import { PropsWithChildren, useCallback, useMemo, useState } from "react";

import { TwoFactorAuthenticationModal } from "@/features/auth/components/TwoFactorAuthenticationModal";
import { TwoFactorAuthenticationContext } from "@/features/auth/context";

export const TwoFactorAuthenticationProvider = ({ children }: PropsWithChildren) => {
    const [isAuthorizationInProgress, setIsAuthorizationInProgress] = useState(false);

    const cancelAuthorizationProcess = useCallback(() => {
        setIsAuthorizationInProgress(false);
    }, []);

    const startAuthorizationProcess = useCallback(() => {
        setIsAuthorizationInProgress(true);
    }, []);

    const contextValue = useMemo(
        () => ({
            startAuthorizationProcess,
            cancelAuthorizationProcess,
            isAuthorizationInProgress,
        }),
        [startAuthorizationProcess, cancelAuthorizationProcess, isAuthorizationInProgress]
    );

    return (
        <TwoFactorAuthenticationContext value={contextValue}>
            <TwoFactorAuthenticationModal />
            {children}
        </TwoFactorAuthenticationContext>
    );
};
