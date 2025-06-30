import styles from "./styles/EntryGoalsListSection.module.scss";

import { Spinner } from "@/components/Spinner";
import { GoalLinkItem } from "@/features/entries/components/GoalLinkItem/GoalLinkItem.tsx";
import { Goal } from "@/features/goals/types/Goal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type EntryGoalsListSectionProps = {
    goals: Goal[];
    linked?: boolean;
    onAction: (goalId: string) => void;
    areGoalsLoading: boolean;
    header: string;
};

export const EntryGoalsListSection = ({ goals, header, areGoalsLoading, onAction, linked }: EntryGoalsListSectionProps) => {
    const t = useTranslate();

    return (
        <div className={styles.container}>
            <h3 className={styles.header}>{header}</h3>
            {!goals.length && <p className={styles.caption}>{t("entries.goals.list.noResultsCaption")}</p>}

            <ul className={styles.list}>
                {goals.map((goal) => (
                    <GoalLinkItem onClick={() => onAction(goal.id)} linked={linked} name={goal.name} key={goal.id} />
                ))}
            </ul>

            {areGoalsLoading && <Spinner className={styles.spinner} />}
        </div>
    );
};
