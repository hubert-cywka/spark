import { PropsWithChildren } from "react";

export type ItemLoaderProps = PropsWithChildren<{
    shouldLoadNext: boolean;
    onLoadNext: () => Promise<unknown>;
    root?: Element | null;
    margin?: string;
}>;
