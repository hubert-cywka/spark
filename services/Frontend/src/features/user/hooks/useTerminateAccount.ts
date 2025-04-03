import { useMutation } from "@tanstack/react-query";

import { UserService } from "@/features/user/api/userService.ts";

export const useTerminateAccount = () => {
    return useMutation({
        mutationFn: UserService.terminateAccount,
    });
};
