import { useQuery } from "@tanstack/react-query";

import { TwoFactorAuthenticationService } from "@/features/auth/api/2fa/twoFactorAuthenticationService.ts";
import { TwoFactorAuthenticationQueryKeyFactory } from "@/features/auth/utils/twoFactorAuthenticationQueryKeyFactory.ts";

export const useGetEnabled2FAOptions = () => {
    return useQuery({
        queryFn: TwoFactorAuthenticationService.getEnabledMethods,
        queryKey: TwoFactorAuthenticationQueryKeyFactory.createForAll(),
    });
};
