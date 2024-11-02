import { useMutation } from "@tanstack/react-query";

import { GoogleAuthService } from "@/features/openIDConnect/google/api/GoogleAuthService";
import { useLoginWithGoogleEvents } from "@/features/openIDConnect/google/hooks/useLoginWithGoogleEvents";

export const useLoginWithGoogle = () => {
    const { onLoginSuccess, onLoginError } = useLoginWithGoogleEvents();

    return useMutation({
        mutationFn: GoogleAuthService.login,
        onError: onLoginError,
        onSuccess: onLoginSuccess,
    });
};
