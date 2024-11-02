"use client";

import { PropsWithChildren } from "react";

import { useAccessValidation } from "@/features/auth/hooks/useAccessValidation";
import { AccessScope } from "@/features/auth/types/Identity";

type AccessGuardProps = PropsWithChildren<{ requiredScopes: AccessScope[] }>;

export const AccessGuard = ({ children, requiredScopes }: AccessGuardProps) => {
    const { validate } = useAccessValidation();

    if (!validate(requiredScopes)) {
        return null;
    }

    return <>{children}</>;
};
