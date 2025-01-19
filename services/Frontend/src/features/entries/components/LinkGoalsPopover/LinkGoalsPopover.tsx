import { useState } from "react";
import { Plus } from "lucide-react";

import styles from "./styles/LinkGoalsPopover.module.scss";

import { IconButton } from "@/components/IconButton";
import { Field } from "@/components/Input";
import { Popover } from "@/components/Popover";
import { Spinner } from "@/components/Spinner";
import { GoalLinkItem } from "@/features/entries/components/GoalLinkItem/GoalLinkItem";
import { useLinkEntryWithGoal } from "@/features/entries/hooks";
import { useLinkEntryWithGoalEvents } from "@/features/entries/hooks/useEntryLink/useLinkEntryWithGoalEvents";
import { useGoals } from "@/features/goals/hooks/useGoals/useGoals";
import useDebounce from "@/hooks/useDebounce";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const SEARCH_DEBOUNCE_IN_MS = 350;

type LinkGoalsPopoverProps = {
    entryId: string;
};

export const LinkGoalsPopover = ({ entryId }: LinkGoalsPopoverProps) => {
    const t = useTranslate();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useDebounce(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_IN_MS, [search]);

    const { data: unlinkedGoalsData, isLoading: areUnlinkedGoalsLoading } = useGoals({
        excludeEntries: [entryId],
        name: debouncedSearch,
        pageSize: 5,
    });
    const unlinkedGoals = unlinkedGoalsData?.pages.flatMap((page) => page.data) ?? [];

    const { onLinkEntryError } = useLinkEntryWithGoalEvents();
    const { mutateAsync: link } = useLinkEntryWithGoal();

    const onLink = async (goalId: string) => {
        try {
            await link({ entryId, goalId });
        } catch (err) {
            onLinkEntryError(err);
        }
    };

    return (
        <Popover offset={15} trigger={<IconButton size="1" variant="secondary" iconSlot={Plus} />}>
            <div className={styles.container}>
                <Field label={t("entries.goals.list.unlinked.search")} size="1" value={search} onChange={setSearch} autoFocus />
                {areUnlinkedGoalsLoading && <Spinner className={styles.spinner} />}

                <div>
                    <p className={styles.header}>{t("entries.goals.list.unlinked.header")}</p>
                    {!unlinkedGoals.length && <p className={styles.caption}>{t("entries.goals.list.unlinked.noResultsCaption")}</p>}

                    <ul className={styles.list}>
                        {unlinkedGoals.map((goal) => (
                            <GoalLinkItem onClick={() => onLink(goal.id)} name={goal.name} key={goal.id} />
                        ))}
                    </ul>
                </div>
            </div>
        </Popover>
    );
};
