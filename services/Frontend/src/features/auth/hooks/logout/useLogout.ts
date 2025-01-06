import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authentication/authenticationService";

export const useLogout = () => {
    return useMutation({
        mutationFn: AuthenticationService.logout,
    });
};
