import { PropsWithChildren, useState } from "react";
import { CheckSquareIcon, SquareIcon, StarIcon, StarOffIcon, TrashIcon } from "lucide-react";

import { Menu, MenuItem, MenuItemSeparator } from "@/components/Menu";
import { DeleteEntriesByDateModal } from "@/features/daily/components/DeleteDailyModal/DeleteEntriesByDateModal.tsx";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { ISODateString } from "@/types/ISODateString";

type DayHeaderContextMenuProps = PropsWithChildren<{
    onDelete: () => Promise<void>;
    onIsFeaturedChange: (value: boolean) => void;
    onStatusChange: (value: boolean) => void;
    date: ISODateString;
}>;

export const DayHeaderContextMenu = ({ children, onStatusChange, onIsFeaturedChange, onDelete, date }: DayHeaderContextMenuProps) => {
    const t = useTranslate();
    const [isDeleteEntriesModalOpen, setIsDeleteEntriesModalOpen] = useState(false);
    const openDeleteEntriesModal = () => setIsDeleteEntriesModalOpen(true);

    return (
        <>
            <Menu trigger={children}>
                <MenuItem
                    onAction={() => onStatusChange(true)}
                    label={t("daily.day.actions.markAsCompleted.label")}
                    iconSlot={CheckSquareIcon}
                />
                <MenuItem onAction={() => onStatusChange(false)} label={t("daily.day.actions.markAsPending.label")} iconSlot={SquareIcon} />

                <MenuItemSeparator />

                <MenuItem
                    onAction={() => onIsFeaturedChange(true)}
                    label={t("daily.day.actions.markAsFeatured.label")}
                    iconSlot={StarIcon}
                />
                <MenuItem
                    onAction={() => onIsFeaturedChange(false)}
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
