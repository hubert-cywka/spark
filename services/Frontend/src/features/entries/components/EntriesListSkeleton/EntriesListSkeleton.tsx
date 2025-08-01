import Skeleton from "react-loading-skeleton";

import styles from "./styles/EntriesListSkeleton.module.scss";

const MIN_NUM_OF_ITEMS = 2;
const MAX_ADDITIONAL_NUM_OF_ITEMS = 5;

const ITEM_HEIGHT = 20;
const MIN_ITEM_WIDTH_IN_PX = 50;
const ADDITIONAL_ITEM_WIDTH_IN_PCT = 10;

export const EntriesListSkeleton = () => {
    const randomItemCount = Math.floor(Math.random() * MAX_ADDITIONAL_NUM_OF_ITEMS) + MIN_NUM_OF_ITEMS;
    const getRandomWidth = () => `${Math.floor(Math.random() * MIN_ITEM_WIDTH_IN_PX) + ADDITIONAL_ITEM_WIDTH_IN_PCT}%`;

    return (
        <ul className={styles.entries}>
            {Array.from({ length: randomItemCount }).map((_, index) => (
                <li key={index}>
                    <Skeleton width={getRandomWidth()} height={ITEM_HEIGHT} />
                </li>
            ))}
        </ul>
    );
};
