import { PropsWithChildren } from "react";

export type MediaRenderProps = PropsWithChildren<{
    minWidth?: number;
    maxWidth?: number;
}>;
