import { PropsWithChildren } from "react";

export type TooltipProps = PropsWithChildren<{
    label?: string | number;
    delay?: number;
}>;
