import { PropsWithChildren, useCallback, useMemo, useState } from "react";

import { TwoFactorAuthorizationModal } from "@/features/auth/components/TwoFactorAuthorizationModal";
import { TwoFactorAuthorizationContext } from "@/features/auth/context";

export const TwoFactorAuthorizationProvider = ({ children }: PropsWithChildren) => {
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
        <TwoFactorAuthorizationContext value={contextValue}>
            <TwoFactorAuthorizationModal />
            {children}
        </TwoFactorAuthorizationContext>
    );
};
