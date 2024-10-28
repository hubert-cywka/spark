import { PropsWithChildren } from "react";

export type AlertVariant = "danger" | "success" | "info" | "neutral";

export type AlertProps = PropsWithChildren<{
    variant: AlertVariant;
}>;
