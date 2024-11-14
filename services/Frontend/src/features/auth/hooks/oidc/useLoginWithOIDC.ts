import { useMutation } from "@tanstack/react-query";

import { OpenIDConnectService } from "@/features/auth/api/openIDConnectService";

export const useLoginWithOIDC = () => {
    return useMutation({
        mutationFn: OpenIDConnectService.login,
    });
};
