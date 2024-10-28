import { PropsWithChildren } from "react";
import clsx from "clsx";
import Link, { LinkProps } from "next/link";

import styles from "./styles/Anchor.module.scss";

export const Anchor = ({ children, ...props }: PropsWithChildren<LinkProps>) => {
    return (
        <Link {...props} className={clsx(styles.anchor)}>
            {children}
        </Link>
    );
};
