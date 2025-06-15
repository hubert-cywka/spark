import { PropsWithChildren } from "react";

export type ContainerProps = PropsWithChildren<{
    size?: "1" | "2" | "3" | "4" | "5" | "full-width";
    className?: string;
}>;
