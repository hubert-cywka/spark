import { useMutation } from "@tanstack/react-query";

import { AccountActivationService } from "@/features/auth/api/accountActivationService";
import { useRequestAccountActivationTokenEvents } from "@/features/auth/hooks/useRequestAccountActivationTokenEvents";

export const useRequestAccountActivationToken = () => {
    const { onRequestActivationError, onRequestActivationSuccess } = useRequestAccountActivationTokenEvents();

    return useMutation({
        mutationFn: AccountActivationService.requestAccountActivationToken,
        onSuccess: onRequestActivationSuccess,
        onError: onRequestActivationError,
    });
};
