import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { AccountActivationService } from "@/features/auth/api/accountActivationService";

const ACCOUNT_ACTIVATION_TOKEN_QUERY_PARAM_NAME = "token";

export const useAccountActivation = () => {
    const [searchParams] = useSearchParams();

    const redeemActivationToken = useMutation({
        mutationFn: AccountActivationService.activateAccount,
    });
    const requestActivationToken = useMutation({
        mutationFn: AccountActivationService.requestAccountActivationToken,
    });
    const activationToken = useMemo(() => searchParams.get(ACCOUNT_ACTIVATION_TOKEN_QUERY_PARAM_NAME), [searchParams]);

    return { redeemActivationToken, requestActivationToken, activationToken };
};
