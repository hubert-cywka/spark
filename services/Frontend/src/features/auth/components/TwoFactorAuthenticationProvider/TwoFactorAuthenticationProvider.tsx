import { PropsWithChildren, useCallback, useMemo, useState } from "react";

import { TwoFactorAuthenticationModal } from "@/features/auth/components/TwoFactorAuthenticationModal";
import { TwoFactorAuthenticationContext } from "@/features/auth/context";
import { AccessScope } from "@/features/auth/types/Identity";
import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";

export const TwoFactorAuthenticationProvider = ({ children }: PropsWithChildren) => {
    const [isAuthenticationInProgress, setIsAuthenticationInProgress] = useState(false);
    const [scopesToActivate, setScopesToActivate] = useState<AccessScope[]>([]);
    const [method, setMethod] = useState<TwoFactorAuthenticationMethod | null>(null);

    const cancelAuthenticationProcess = useCallback(() => {
        setIsAuthenticationInProgress(false);
        setScopesToActivate([]);
        setMethod(null);
    }, []);

    const startAuthenticationProcess = useCallback((scopes: AccessScope[]) => {
        setIsAuthenticationInProgress(true);
        setScopesToActivate(scopes);
    }, []);

    const onClose = () => {
        cancelAuthenticationProcess();
    };

    const contextValue = useMemo(
        () => ({
            startAuthenticationProcess,
            cancelAuthenticationProcess,
            isAuthenticationInProgress,
        }),
        [cancelAuthenticationProcess, startAuthenticationProcess, isAuthenticationInProgress]
    );

    return (
        <TwoFactorAuthenticationContext value={contextValue}>
            <TwoFactorAuthenticationModal
                scopesToActivate={scopesToActivate}
                onClose={onClose}
                method={method}
                onMethodSelected={setMethod}
            />
            {children}
        </TwoFactorAuthenticationContext>
    );
};
