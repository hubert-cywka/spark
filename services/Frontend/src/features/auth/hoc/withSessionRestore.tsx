import { FC } from "react";

import "server-only";

import { AuthSessionRestorer } from "@/features/auth/components/AuthSessionRestorer/AuthSessionRestorer";

export function withSessionRestore<T extends object>(Component: FC<T>) {
    const WrappedComponent = (props: T) => (
        <AuthSessionRestorer>
            <Component {...props} />
        </AuthSessionRestorer>
    );

    WrappedComponent.displayName = `withSessionRestore(${Component.displayName || Component.name || "Component"})`;
    return WrappedComponent;
}
