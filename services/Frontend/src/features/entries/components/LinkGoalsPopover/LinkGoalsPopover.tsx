import { PropsWithChildren, useState } from "react";

import styles from "./styles/LinkGoalsPopover.module.scss";

import { Field } from "@/components/Input";
import { Popover } from "@/components/Popover";
import { EntryGoalsList } from "@/features/entries/components/LinkGoalsPopover/components/EntryGoalsList/EntryGoalsList.tsx";
import useDebounce from "@/hooks/useDebounce";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const SEARCH_DEBOUNCE_IN_MS = 350;

type LinkGoalsPopoverProps = PropsWithChildren<{
    entryId: string;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}>;

export const LinkGoalsPopover = ({ entryId, isOpen, onOpenChange, children }: LinkGoalsPopoverProps) => {
    const t = useTranslate();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useDebounce(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_IN_MS, [search]);

    return (
        <Popover offset={15} isOpen={isOpen} onOpenChange={onOpenChange} trigger={children}>
            <section className={styles.container}>
                <search>
                    <Field label={t("entries.goals.list.unlinked.search")} size="1" value={search} onChange={setSearch} autoFocus />
                </search>

                <EntryGoalsList nameFilter={debouncedSearch} entryId={entryId} />
            </section>
        </Popover>
    );
};
