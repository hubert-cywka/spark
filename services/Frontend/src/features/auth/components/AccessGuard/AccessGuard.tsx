"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppRoute } from "@/app/appRoute";
import { useAccessValidation } from "@/features/auth/hooks/useAccessValidation";
import { AccessScope } from "@/features/auth/types/Identity";

type AccessGuardProps = PropsWithChildren<{
    requiredScopes: AccessScope[];
    redirectUnauthorizedTo?: AppRoute;
}>;

export const AccessGuard = ({ children, requiredScopes, redirectUnauthorizedTo }: AccessGuardProps) => {
    const { validate } = useAccessValidation();
    const isAllowed = validate(requiredScopes);
    const router = useRouter();

    useEffect(() => {
        if (!redirectUnauthorizedTo || isAllowed) {
            return;
        }

        router.replace(redirectUnauthorizedTo);
    }, [isAllowed, redirectUnauthorizedTo, router]);

    if (!isAllowed) {
        return null;
    }

    return <>{children}</>;
};
