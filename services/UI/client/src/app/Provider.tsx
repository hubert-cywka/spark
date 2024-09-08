import { PropsWithChildren } from "react";

type ProviderProps = PropsWithChildren;

export const Provider = ({ children }: ProviderProps) => {
    return <>{children}</>;
};
