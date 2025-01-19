import Skeleton from "react-loading-skeleton";
import classNames from "clsx";

import styles from "./styles/DayHeader.module.scss";

export const DayHeaderSkeleton = () => {
    return (
        <div className={classNames(styles.header, styles.skeleton)}>
            <Skeleton className={classNames(styles.input, styles.skeletonHeader)} />

            <div className={styles.buttons}>
                <Skeleton className={styles.skeletonButton} />
                <Skeleton className={styles.skeletonButton} />
            </div>
        </div>
    );
};
