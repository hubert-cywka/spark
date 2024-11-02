import clsx from "clsx";

import { SpinnerProps } from "./types/Spinner";

import styles from "./styles/Spinner.module.scss";

export const Spinner = ({ size = "2", className }: SpinnerProps) => {
    return <div className={clsx(styles.spinner, className)} data-size={size} />;
};
