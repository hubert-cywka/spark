import { PropsWithChildren } from "react";

export type CardSize = "1" | "2" | "3";

export type CardProps = PropsWithChildren<{
    size?: CardSize;
    className?: string;
}>;
