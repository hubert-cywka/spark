import { PropsWithChildren } from "react";
import { CheckSquareIcon, SquareIcon, StarIcon, StarOffIcon, TrashIcon } from "lucide-react";

import { Menu, MenuItem, MenuItemSeparator } from "@/components/Menu";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DailyEntryContextMenuProps = PropsWithChildren<{
    isCompleted: boolean;
    isFeatured: boolean;
    onDelete: () => unknown;
    onChangeStatus: (status: boolean) => void;
    onChangeIsFeatured: (isFeatured: boolean) => void;
}>;

export const DailyEntryContextMenu = ({
    children,
    onDelete,
    onChangeIsFeatured,
    onChangeStatus,
    isFeatured,
    isCompleted,
}: DailyEntryContextMenuProps) => {
    const t = useTranslate();

    return (
        <Menu trigger={children}>
            <MenuItem
                onAction={() => onChangeStatus(!isCompleted)}
                label={
                    isCompleted
                        ? t("entries.actionsMenu.actions.markAsPending.label")
                        : t("entries.actionsMenu.actions.markAsCompleted.label")
                }
                iconSlot={isCompleted ? SquareIcon : CheckSquareIcon}
            />

            <MenuItem
                onAction={() => onChangeIsFeatured(!isFeatured)}
                label={
                    isFeatured
                        ? t("entries.actionsMenu.actions.markAsNonFeatured.label")
                        : t("entries.actionsMenu.actions.markAsFeatured.label")
                }
                iconSlot={isFeatured ? StarOffIcon : StarIcon}
            />

            <MenuItemSeparator />

            <MenuItem onAction={onDelete} variant="danger" label={t("entries.actionsMenu.actions.delete.label")} iconSlot={TrashIcon} />
        </Menu>
    );
};
