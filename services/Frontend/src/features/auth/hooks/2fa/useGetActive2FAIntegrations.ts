import { useQuery } from "@tanstack/react-query";

import { TwoFactorAuthenticationService } from "@/features/auth/api/2fa/twoFactorAuthenticationService.ts";
import { TwoFactorAuthenticationQueryKeyFactory } from "@/features/auth/utils/twoFactorAuthenticationQueryKeyFactory.ts";

export const useGetActive2FAIntegrations = () => {
    return useQuery({
        queryFn: TwoFactorAuthenticationService.getActiveIntegrations,
        queryKey: TwoFactorAuthenticationQueryKeyFactory.createForAll(),
    });
};
