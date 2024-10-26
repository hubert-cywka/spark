import { useMutation } from "@tanstack/react-query";

import { AccountActivationService } from "@/features/auth/api/accountActivationService";

export const useRequestAccountActivationToken = () => {
    return useMutation({
        mutationFn: AccountActivationService.requestAccountActivationToken,
    });
};
