import Skeleton from "react-loading-skeleton";

import styles from "./styles/ExportEntriesList.module.scss";

const ITEM_HEIGHT = 70;

export const ExportEntriesListSkeleton = () => {
    return (
        <ul className={styles.list}>
            {Array.from({ length: 3 }).map((_, index) => (
                <li key={index} className={styles.skeletonItem}>
                    <Skeleton width="100%" height={ITEM_HEIGHT} />
                </li>
            ))}
        </ul>
    );
};
