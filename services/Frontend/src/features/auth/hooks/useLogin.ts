import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";

export const useLogin = () => {
    return useMutation({
        mutationFn: AuthenticationService.login,
    });
};
