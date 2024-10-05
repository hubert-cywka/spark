import { useEffect } from "react";
import { useNavigate } from "react-router";

import { AppRoute } from "@/app/routes/appRoute";
import { Alert } from "@/components/alert/Alert";
import { useAccountActivation } from "@/features/auth/hooks/useAccountActivation";
import { wait } from "@/utils/wait";

const REDIRECTION_DELAY = 3000;

export const AccountActivationHandler = () => {
    const navigate = useNavigate();
    const { redeemActivationToken, activationToken } = useAccountActivation();
    const { mutateAsync, isSuccess, isPending, error } = redeemActivationToken;

    useEffect(() => {
        const activateAccount = async (token: string) => {
            await mutateAsync({ activationToken: token });
            await wait(REDIRECTION_DELAY);
            navigate(AppRoute.LOGIN);
        };

        if (activationToken) {
            void activateAccount(activationToken);
        }
    }, [activationToken, mutateAsync, navigate]);

    if (isSuccess) {
        return <Alert variant="success">Your account has been activated! You will be redirected soon...</Alert>;
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
