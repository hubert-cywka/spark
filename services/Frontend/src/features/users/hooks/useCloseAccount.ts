import { useMutation } from "@tanstack/react-query";

import { UsersService } from "@/features/users/api/usersService.ts";

export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: UsersService.closeAccount,
    });
};
