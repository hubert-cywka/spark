import { FC } from "react";

import "server-only";

import { AppRoute } from "@/app/appRoute";
import { AccessGuard } from "@/features/auth/components/AccessGuard";
import { AccessScope } from "@/features/auth/types/Identity";

export default function withAuthorization<T extends object>(Component: FC<T>) {
    return (scopes: AccessScope[], redirectTo: AppRoute) => {
        const WrappedComponent = (props: T) => (
            <AccessGuard requiredScopes={scopes} redirectUnauthorizedTo={redirectTo}>
                <Component {...props} />
            </AccessGuard>
        );

        WrappedComponent.displayName = `withAuthorization(${Component.displayName || Component.name || "Component"})`;
        return WrappedComponent;
    };
}

export function onlyAsUnauthenticated<T extends object>(Component: FC<T>) {
    return withAuthorization<T>(Component)(["browse_as_unauthenticated"], AppRoute.DAILY);
}

export function onlyAsAuthenticated<T extends object>(Component: FC<T>) {
    return withAuthorization<T>(Component)(["browse_as_authenticated"], AppRoute.LOGIN);
}
