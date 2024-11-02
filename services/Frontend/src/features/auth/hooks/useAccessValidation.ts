import { useCallback } from "react";

import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import { AccessScope } from "@/features/auth/types/Identity";

export const useAccessValidation = () => {
    const userScopes = useAuthStore().identity?.scopes;

    const validate = useCallback(
        (requiredScopes: AccessScope[]) => {
            if (!requiredScopes?.length) {
                return true;
            }

            if (!userScopes?.length) {
                return false;
            }

            return requiredScopes.every((required) => userScopes.includes(required));
        },
        [userScopes]
    );

    return { validate };
};
