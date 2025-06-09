import classNames from "clsx";

import styles from "./styles/AuroraBackground.module.scss";

import Aurora from "@/components/Aurora/Aurora.tsx";

export const AuroraBackground = () => {
    return (
        <div className={classNames(styles.auroraWrapper)}>
            <Aurora className={classNames(styles.aurora, styles.top)} />
            <Aurora className={classNames(styles.aurora, styles.bottom)} />
        </div>
    );
};
