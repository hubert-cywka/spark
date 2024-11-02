import clsx from "clsx";
import Link from "next/link";

import { AnchorProps } from "./types/Anchor";

import styles from "./styles/Anchor.module.scss";

export const Anchor = ({ children, className, ...props }: AnchorProps) => {
    return (
        <Link {...props} className={clsx(styles.anchor, className)}>
            {children}
        </Link>
    );
};
