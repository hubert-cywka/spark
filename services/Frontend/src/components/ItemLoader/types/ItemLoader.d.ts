import { PropsWithChildren } from "react";

export type ItemLoaderProps = PropsWithChildren<{
    isLoaderVisible: boolean;
    shouldLoadNext: boolean;
    onLoadNext: () => Promise<unknown>;
    root?: Element | null;
    margin?: string;
}>;
