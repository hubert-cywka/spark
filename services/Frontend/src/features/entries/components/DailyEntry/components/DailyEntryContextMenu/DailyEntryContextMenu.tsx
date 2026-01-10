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
            {!isCompleted && (
                <MenuItem
                    onAction={() => onChangeStatus(true)}
                    label={t("entries.actionsMenu.actions.markAsCompleted.label")}
                    iconSlot={CheckSquareIcon}
                />
            )}
            {isCompleted && (
                <MenuItem
                    onAction={() => onChangeStatus(false)}
                    label={t("entries.actionsMenu.actions.markAsPending.label")}
                    iconSlot={SquareIcon}
                />
            )}

            {!isFeatured && (
                <MenuItem
                    onAction={() => onChangeIsFeatured(true)}
                    label={t("entries.actionsMenu.actions.markAsFeatured.label")}
                    iconSlot={StarIcon}
                />
            )}
            {isFeatured && (
                <MenuItem
                    onAction={() => onChangeIsFeatured(false)}
                    label={t("entries.actionsMenu.actions.markAsNonFeatured.label")}
                    iconSlot={StarOffIcon}
                />
            )}

            <MenuItemSeparator />

            <MenuItem onAction={onDelete} variant="danger" label={t("entries.actionsMenu.actions.delete.label")} iconSlot={TrashIcon} />
        </Menu>
    );
};
