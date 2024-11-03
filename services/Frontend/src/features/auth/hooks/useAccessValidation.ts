import { useCallback } from "react";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { AccessScope } from "@/features/auth/types/Identity";

export const useAccessValidation = () => {
    const accessScopes = useAuthSession().scopes;

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
