import { PropsWithChildren } from "react";
import clsx from "clsx";
import Link, { LinkProps } from "next/link";

import styles from "./styles/Anchor.module.scss";

type AnchorProps = PropsWithChildren<LinkProps> & { className?: string };

export const Anchor = ({ children, className, ...props }: AnchorProps) => {
    return (
        <Link {...props} className={clsx(styles.anchor, className)}>
            {children}
        </Link>
    );
};
