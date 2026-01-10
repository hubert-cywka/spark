import { EllipsisIcon, Pencil, Plus } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputPassiveModeActionsRenderProps } from "@/components/PassiveTextInput";
import { DayHeaderContextMenu } from "@/features/daily/components/DayHeader/components/DayHeaderContextMenu/DayHeaderContextMenu.tsx";
import { ISODateString } from "@/types/ISODateString";

type DayHeaderPassiveModeActionsRenderProps = {
    date: ISODateString;
    onCreateEntryDraft: () => void;
    onDeleteEntries: () => Promise<void>;
    onEntriesIsFeaturedChange: (value: boolean) => Promise<void>;
    onEntriesStatusChange: (value: boolean) => Promise<void>;
} & PassiveTextInputPassiveModeActionsRenderProps;

export const DayHeaderPassiveModeActionsRender = ({
    date,
    onStartEditMode,
    onCreateEntryDraft,
    onDeleteEntries,
    onEntriesStatusChange,
    onEntriesIsFeaturedChange,
    translationFn,
}: DayHeaderPassiveModeActionsRenderProps) => {
    return (
        <>
            <IconButton
                variant="secondary"
                size="1"
                onPress={onCreateEntryDraft}
                iconSlot={Plus}
                tooltip={translationFn("daily.day.actions.createDraftEntry.label")}
                aria-label={translationFn("daily.day.actions.createDraftEntry.label")}
            />
            <IconButton
                variant="secondary"
                size="1"
                onPress={onStartEditMode}
                iconSlot={Pencil}
                tooltip={translationFn("daily.day.actions.edit.label")}
                aria-label={translationFn("daily.day.actions.edit.label")}
            />

            <DayHeaderContextMenu
                onDelete={onDeleteEntries}
                onEntriesStatusChange={onEntriesStatusChange}
                onEntriesIsFeaturedChange={onEntriesIsFeaturedChange}
                date={date}
            >
                <IconButton
                    variant="secondary"
                    size="1"
                    iconSlot={EllipsisIcon}
                    tooltip={translationFn("daily.day.actions.more.label")}
                    aria-label={translationFn("daily.day.actions.more.label")}
                />
            </DayHeaderContextMenu>
        </>
    );
};
