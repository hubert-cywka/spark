"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppRoute } from "@/app/appRoute";
import { useAccessValidation } from "@/features/auth/hooks";
import { AccessScope } from "@/features/auth/types/Identity";

type AccessGuardProps = PropsWithChildren<{
    requiredScopes: AccessScope[];
    redirectUnauthorizedTo?: AppRoute;
}>;

export const AccessGuard = ({ children, requiredScopes, redirectUnauthorizedTo }: AccessGuardProps) => {
    const { validate } = useAccessValidation();
    const { hasAccess } = validate(requiredScopes);
    const router = useRouter();

    useEffect(() => {
        if (!redirectUnauthorizedTo || hasAccess) {
            return;
        }

        router.replace(redirectUnauthorizedTo);
    }, [hasAccess, redirectUnauthorizedTo, router]);

    if (!hasAccess) {
        return null;
    }

    return <>{children}</>;
};
