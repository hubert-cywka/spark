import { PropsWithChildren } from "react";
import classNames from "clsx";

import styles from "./styles/GradientText.module.scss";

type GradientTextProps = PropsWithChildren<{
    className?: string;
}>;

export const GradientText = ({ className, children }: GradientTextProps) => {
    return <span className={classNames(className, styles.gradientText)}>{children}</span>;
};
