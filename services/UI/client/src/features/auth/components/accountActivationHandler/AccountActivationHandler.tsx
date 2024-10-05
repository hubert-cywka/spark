import { useEffect } from "react";
import { useNavigate } from "react-router";

import { AppRoute } from "@/app/routes/appRoute";
import { Alert } from "@/components/alert/Alert";
import { Anchor } from "@/components/anchor/Anchor";
import { useActivateAccount } from "@/features/auth/hooks/useActivateAccount";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const AccountActivationHandler = () => {
    const navigate = useNavigate();
    const { activateAccount, activationToken } = useActivateAccount();
    const { mutateAsync, isSuccess, isPending, error } = activateAccount;

    useEffect(() => {
        if (activationToken) {
            void mutateAsync({ activationToken });
        }
    }, [activationToken, mutateAsync, navigate]);

    const navigateToLoginPage = () => {
        navigate(AppRoute.LOGIN);
    };

    if (isSuccess) {
        return (
            <Alert variant="success">
                Your account has been activated! Click here to <Anchor onPress={navigateToLoginPage}>log in</Anchor>
            </Alert>
        );
    }

    if (isPending) {
        return <Alert variant="info">Activating your account...</Alert>;
    }

    if (error) {
        return <Alert variant="danger">{getErrorMessage(error)}</Alert>;
    }

    return (
        <Alert variant="info">
            Please check your email to find account activation link. We always send one immediately after registration.
        </Alert>
    );
};
