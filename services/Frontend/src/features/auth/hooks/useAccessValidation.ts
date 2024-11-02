import { useCallback } from "react";

import { useAuthStore } from "@/features/auth/hooks/useAuthStore";
import { AccessScope } from "@/features/auth/types/Identity";

export const useAccessValidation = () => {
    const accessScopes = useAuthStore().scopes;

    const validate = useCallback(
        (requiredScopes: AccessScope[]) => {
            if (!requiredScopes?.length) {
                return true;
            }

            if (!accessScopes?.length) {
                return false;
            }

            return requiredScopes.every((required) => accessScopes.includes(required));
        },
        [accessScopes]
    );

    return { validate };
};
