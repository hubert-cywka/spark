import { FC } from "react";

import "server-only";

import { AuthSessionRestorer } from "@/features/auth/components/AuthSessionRestorer/AuthSessionRestorer";

export function withSessionRestore<T extends object>(Component: FC<T>, options: { inBackground?: boolean } = {}) {
    const WrappedComponent = (props: T) => (
        <AuthSessionRestorer inBackground={options.inBackground}>
            <Component {...props} />
        </AuthSessionRestorer>
    );

    WrappedComponent.displayName = `withSessionRestore(${Component.displayName || Component.name || "Component"})`;
    return WrappedComponent;
}
