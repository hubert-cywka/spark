import { useEffect } from "react";

import { Alert } from "@/components/alert/Alert";
import { useAccountActivation } from "@/features/auth/hooks/useAccountActivation";

export const AccountActivationHandler = () => {
    const { redeemActivationToken, activationToken } = useAccountActivation();
    const { mutateAsync, isSuccess, isPending, error } = redeemActivationToken;

    useEffect(() => {
        if (activationToken) {
            void mutateAsync({ activationToken });
        }
    }, [activationToken, mutateAsync]);

    if (isSuccess) {
        return <Alert variant="success">Your account has been activated!</Alert>;
    }

    if (error) {
        return <Alert variant="danger">{error?.message}</Alert>;
    }

    if (isPending) {
        return <Alert variant="info">Activating your account...</Alert>;
    }

    return (
        <Alert variant="info">
            Please check your email to find account activation link. We always send one immediately after registration.
        </Alert>
    );
};
