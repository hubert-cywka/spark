import { useMutation } from "@tanstack/react-query";

import { TwoFactorAuthenticationService } from "@/features/auth/api/2fa/twoFactorAuthenticationService.ts";
import { TwoFactorAuthenticationQueryKeyFactory } from "@/features/auth/utils/twoFactorAuthenticationQueryKeyFactory.ts";
import { useQueryCache } from "@/hooks/useQueryCache.ts";

export const useConfirm2FAMethod = () => {
    const { invalidate } = useQueryCache();

    return useMutation({
        mutationFn: TwoFactorAuthenticationService.confirmMethod,
        onSuccess: () => {
            void invalidate(TwoFactorAuthenticationQueryKeyFactory.createForAll());
        },
    });
};
