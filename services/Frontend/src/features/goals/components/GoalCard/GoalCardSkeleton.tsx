import Skeleton from "react-loading-skeleton";
import classNames from "clsx";

import styles from "@/features/goals/components/GoalCard/styles/GoalCard.module.scss";

import { Card } from "@/components/Card";

type GoalCardSkeletonProps = {
    count: number;
};

export const GoalCardSkeleton = ({ count = 1 }: GoalCardSkeletonProps) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Card className={styles.container} key={index}>
                    <Skeleton className={classNames(styles.icon, styles.skeleton, styles.skeletonIcon)} circle />

                    <div className={styles.nameContainer}>
                        <Skeleton className={classNames(styles.deadline, styles.skeleton, styles.skeletonDeadline)} />
                        <Skeleton className={classNames(styles.skeleton, styles.skeletonName, styles.name)} />
                    </div>

                    <div className={styles.progress}>
                        <p className={styles.pointsWrapper}>
                            <Skeleton
                                className={classNames(styles.points, styles.current, styles.skeleton, styles.skeletonProgressCount)}
                            />
                        </p>
                        <Skeleton className={classNames(styles.skeleton, styles.skeletonProgressBar)} />
                    </div>
                </Card>
            ))}
        </>
    );
};
