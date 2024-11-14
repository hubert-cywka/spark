import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";

export const useRegisterWithCredentials = () => {
    return useMutation({
        mutationFn: AuthenticationService.register,
    });
};
