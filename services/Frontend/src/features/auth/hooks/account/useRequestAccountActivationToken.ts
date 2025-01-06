import { useMutation } from "@tanstack/react-query";

import { AccountActivationService } from "@/features/auth/api/account/accountActivationService";

export const useRequestAccountActivationToken = () => {
    return useMutation({
        mutationFn: AccountActivationService.requestAccountActivationToken,
    });
};
