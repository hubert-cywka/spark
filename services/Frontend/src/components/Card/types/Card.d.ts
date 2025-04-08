import { type ComponentPropsWithoutRef, type ElementType } from "react";

export type CardSize = "1" | "2" | "3";
export type CardVariant = "solid" | "semi-translucent" | "translucent";

type CardOwnProps = {
    size?: CardSize;
    variant?: CardVariant;
};

export type CardProps<T extends ElementType = "div"> = CardOwnProps &
    Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps | "as"> & {
        as?: ElementType;
    };
