import { useCallback } from "react";

import { useAuthSession } from "@/features/auth/hooks";
import { AccessScope } from "@/features/auth/types/Identity";

export const useAccessValidation = () => {
    const accessScopes = useAuthSession((state) => state.scopes);

    const validate = useCallback(
        (requiredScopes: AccessScope[]) => {
            if (!requiredScopes?.length) {
                return {
                    hasAccess: true,
                    inactiveScopes: [],
                    missingScopes: [],
                };
            }

            const activeScopes = accessScopes.active || [];
            const inactiveScopes = accessScopes.inactive || [];

            const missingScopes = requiredScopes.filter((required) => ![...activeScopes, ...inactiveScopes].includes(required));
            const hasAccess = missingScopes.length === 0;

            return {
                hasAccess,
                missingScopes,
                inactiveScopes: requiredScopes.filter((required) => inactiveScopes.includes(required)),
            };
        },
        [accessScopes]
    );

    return { validate };
};
