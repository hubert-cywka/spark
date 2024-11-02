import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";

export const useRegister = () => {
    return useMutation({
        mutationFn: AuthenticationService.register,
    });
};
