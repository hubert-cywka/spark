import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authentication/authenticationService";

export const useRegisterWithCredentials = () => {
    return useMutation({
        mutationFn: AuthenticationService.register,
    });
};
