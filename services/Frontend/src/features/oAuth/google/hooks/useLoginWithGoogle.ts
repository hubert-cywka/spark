import { useMutation } from "@tanstack/react-query";

import { GoogleOAuthService } from "@/features/oAuth/google/api/GoogleOAuthService";
import { useLoginWithGoogleEvents } from "@/features/oAuth/google/hooks/useLoginWithGoogleEvents";

export const useLoginWithGoogle = () => {
    const { onLoginSuccess, onLoginError } = useLoginWithGoogleEvents();

    return useMutation({
        mutationFn: GoogleOAuthService.login,
        onError: onLoginError,
        onSuccess: onLoginSuccess,
    });
};
