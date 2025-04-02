import { useMutation } from "@tanstack/react-query";

import { TwoFactorAuthenticationService } from "@/features/auth/api/2fa/twoFactorAuthenticationService.ts";

export const useRequest2FACodeViaEmail = () => {
    return useMutation({
        mutationFn: () => TwoFactorAuthenticationService.requestCode("email"),
    });
};
