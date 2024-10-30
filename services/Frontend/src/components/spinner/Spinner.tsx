import styles from "./styles/Spinner.module.scss";

import { SpinnerProps } from "@/components/spinner/types/Spinner";

export const Spinner = ({ size = "2" }: SpinnerProps) => {
    return <div className={styles.spinner} data-size={size} />;
};
