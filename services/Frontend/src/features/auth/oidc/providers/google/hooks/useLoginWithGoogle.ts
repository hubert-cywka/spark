import { useMutation } from "@tanstack/react-query";

import { OIDCGoogleService } from "../api/OIDCGoogleService";

export const useLoginWithGoogle = () => {
    return useMutation({
        mutationFn: OIDCGoogleService.login,
    });
};
