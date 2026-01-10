import { PropsWithChildren, useState } from "react";
import { CheckSquareIcon, SquareIcon, StarIcon, StarOffIcon, TrashIcon } from "lucide-react";

import { Menu, MenuItem, MenuItemSeparator } from "@/components/Menu";
import { DeleteEntriesByDateModal } from "@/features/daily/components/DeleteDailyModal/DeleteEntriesByDateModal.tsx";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { ISODateString } from "@/types/ISODateString";

type DayHeaderContextMenuProps = PropsWithChildren<{
    onDelete: () => Promise<void>;
    onEntriesIsFeaturedChange: (value: boolean) => Promise<void>;
    onEntriesStatusChange: (value: boolean) => Promise<void>;
    date: ISODateString;
}>;

export const DayHeaderContextMenu = ({
    children,
    onEntriesStatusChange,
    onEntriesIsFeaturedChange,
    onDelete,
    date,
}: DayHeaderContextMenuProps) => {
    const t = useTranslate();
    const [isDeleteEntriesModalOpen, setIsDeleteEntriesModalOpen] = useState(false);
    const openDeleteEntriesModal = () => setIsDeleteEntriesModalOpen(true);

    return (
        <>
            <Menu trigger={children}>
                <MenuItem
                    onAction={() => onEntriesStatusChange(true)}
                    label={t("daily.day.actions.markAsCompleted.label")}
                    iconSlot={CheckSquareIcon}
                />
                <MenuItem
                    onAction={() => onEntriesStatusChange(false)}
                    label={t("daily.day.actions.markAsPending.label")}
                    iconSlot={SquareIcon}
                />
                <MenuItemSeparator />

                <MenuItem
                    onAction={() => onEntriesIsFeaturedChange(true)}
                    label={t("daily.day.actions.markAsFeatured.label")}
                    iconSlot={StarIcon}
                />
                <MenuItem
                    onAction={() => onEntriesIsFeaturedChange(false)}
                    label={t("daily.day.actions.markAsNonFeatured.label")}
                    iconSlot={StarOffIcon}
                />
                <MenuItemSeparator />

                <MenuItem
                    variant="danger"
                    onAction={openDeleteEntriesModal}
                    label={t("daily.day.actions.delete.label")}
                    iconSlot={TrashIcon}
                />
            </Menu>

            <DeleteEntriesByDateModal
                date={date}
                onDelete={onDelete}
                isOpen={isDeleteEntriesModalOpen}
                onOpenChange={setIsDeleteEntriesModalOpen}
            />
        </>
    );
};
