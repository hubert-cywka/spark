import { useCallback } from "react";

import { useAuthSession } from "@/features/auth/hooks";
import { AccessScope } from "@/features/auth/types/Identity";

export const useAccessValidation = () => {
    const accessScopes = useAuthSession((state) => state.scopes);

    const validate = useCallback(
        (requiredScopes: AccessScope[]) => {
            if (!requiredScopes?.length) {
                return true;
            }

            if (!accessScopes.active?.length) {
                return false;
            }

            return requiredScopes.every((required) => accessScopes.active.includes(required));
        },
        [accessScopes]
    );

    return { validate };
};
