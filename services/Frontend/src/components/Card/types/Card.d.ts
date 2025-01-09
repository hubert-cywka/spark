import { HTMLAttributes, PropsWithChildren } from "react";

export type CardSize = "1" | "2" | "3";

export type CardVariant = "solid" | "semi-translucent" | "translucent";

export type CardProps = HTMLAttributes<HTMLDivElement> &
    PropsWithChildren<{
        size?: CardSize;
        variant?: CardVariant;
    }>;
