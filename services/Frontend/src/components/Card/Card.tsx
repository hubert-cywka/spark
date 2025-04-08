import { type ElementType, ComponentRef, ForwardedRef, forwardRef } from "react";
import classNames from "clsx";

import { type CardProps } from "./types/Card";

import styles from "./styles/Card.module.scss";

const CardInner = <T extends ElementType>(
    { as: Tag = "div" as T, children, className, size = "2", variant = "solid", ...rest }: CardProps<T>,
    ref: ForwardedRef<ComponentRef<T>>
) => {
    return (
        <Tag ref={ref} data-size={size} data-variant={variant} className={classNames(styles.container, className)} {...rest}>
            {children}
        </Tag>
    );
};

export const Card = forwardRef(CardInner);

Card.displayName = "Card";
