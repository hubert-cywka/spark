import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { AccountActivationService } from "@/features/auth/api/accountActivationService";

const ACCOUNT_ACTIVATION_TOKEN_QUERY_PARAM_NAME = "token";

export const useActivateAccount = () => {
    const searchParams = useSearchParams();
    const activationToken = useMemo(() => searchParams.get(ACCOUNT_ACTIVATION_TOKEN_QUERY_PARAM_NAME), [searchParams]);

    const activateAccount = useMutation({
        mutationFn: AccountActivationService.activateAccount,
    });

    return { activateAccount, activationToken };
};
