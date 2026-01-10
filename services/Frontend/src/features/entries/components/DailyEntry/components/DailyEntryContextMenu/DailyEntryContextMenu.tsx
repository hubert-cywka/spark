import { PropsWithChildren, useState } from "react";
import { CalendarIcon, CheckSquareIcon, SquareIcon, StarIcon, StarOffIcon, TargetIcon, TrashIcon } from "lucide-react";

import { Menu, MenuItem, MenuItemSeparator } from "@/components/Menu";
import { UpdateEntryDateModal } from "@/features/entries/components/UpdateEntryDateModal/UpdateEntryDateModal.tsx";
import { Entry } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { ISODateString } from "@/types/ISODateString";

type DailyEntryContextMenuProps = PropsWithChildren<{
    entry: Entry;
    onOpenGoals: () => unknown;
    onDelete: () => unknown;
    onChangeDate: (date: ISODateString) => Promise<unknown>;
    onChangeStatus: (status: boolean) => void;
    onChangeIsFeatured: (isFeatured: boolean) => void;
}>;

export const DailyEntryContextMenu = ({
    children,
    onDelete,
    onChangeIsFeatured,
    onChangeStatus,
    onOpenGoals,
    onChangeDate,
    entry,
}: DailyEntryContextMenuProps) => {
    const t = useTranslate();
    const [isDateChangeModalOpen, setIsDateChangeModalOpen] = useState(false);
    const { isCompleted, isFeatured } = entry;

    const openDateChangeModal = () => {
        setIsDateChangeModalOpen(true);
    };

    return (
        <>
            <Menu trigger={children}>
                <MenuItem onAction={onOpenGoals} iconSlot={TargetIcon} label={t("entries.actionsMenu.actions.openGoals.label")} />
                <MenuItem
                    onAction={openDateChangeModal}
                    iconSlot={CalendarIcon}
                    label={t("entries.actionsMenu.actions.changeDate.label")}
                />

                <MenuItemSeparator />

                <MenuItem
                    onAction={() => onChangeStatus(!isCompleted)}
                    iconSlot={isCompleted ? SquareIcon : CheckSquareIcon}
                    label={
                        isCompleted
                            ? t("entries.actionsMenu.actions.markAsPending.label")
                            : t("entries.actionsMenu.actions.markAsCompleted.label")
                    }
                />

                <MenuItem
                    onAction={() => onChangeIsFeatured(!isFeatured)}
                    iconSlot={isFeatured ? StarOffIcon : StarIcon}
                    label={
                        isFeatured
                            ? t("entries.actionsMenu.actions.markAsNonFeatured.label")
                            : t("entries.actionsMenu.actions.markAsFeatured.label")
                    }
                />

                <MenuItemSeparator />

                <MenuItem onAction={onDelete} variant="danger" label={t("entries.actionsMenu.actions.delete.label")} iconSlot={TrashIcon} />
            </Menu>

            <UpdateEntryDateModal
                onUpdate={onChangeDate}
                defaultDate={entry.date}
                isOpen={isDateChangeModalOpen}
                onOpenChange={setIsDateChangeModalOpen}
            />
        </>
    );
};
