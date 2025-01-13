import Skeleton from "react-loading-skeleton";
import classNames from "clsx";

import styles from "./styles/Day.module.scss";

import { DayHeaderSkeleton } from "@/features/daily/components/Day/components/DayHeader/DayHeaderSkeleton";

type DaySkeletonProps = {
    count?: number;
};

export const DaySkeleton = ({ count = 1 }: DaySkeletonProps) => {
    const randomItemCount = Math.floor(Math.random() * (8 - 2 + 1)) + 2;
    const getRandomWidth = () => `${Math.floor(Math.random() * (50 - 10 + 1)) + 10}%`;

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div className={classNames(styles.container, styles.skeleton)} key={index}>
                    <DayHeaderSkeleton />

                    <ul>
                        {Array.from({ length: randomItemCount }).map((_, index) => (
                            <li key={index}>
                                <Skeleton width={getRandomWidth()} />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    );
};
