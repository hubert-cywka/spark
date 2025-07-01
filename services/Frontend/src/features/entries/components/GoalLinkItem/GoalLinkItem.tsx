import classNames from "clsx";
import { Minus, Plus } from "lucide-react";

import styles from "./styles/GoalLinkItem.module.scss";

import { IconButton } from "@/components/IconButton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type GoalLinkItemProps = {
    linked?: boolean;
    onClick: () => void;
    name: string;
};

export const GoalLinkItem = ({ linked, onClick, name }: GoalLinkItemProps) => {
    const t = useTranslate();
    const label = linked ? t("entries.goals.list.item.unlinkButton.label") : t("entries.goals.list.item.linkButton.label");

    return (
        <li className={styles.goal}>
            <IconButton
                className={classNames({ [styles.linkButton]: !linked }, { [styles.unlinkButton]: linked })}
                iconSlot={linked ? Minus : Plus}
                onPress={onClick}
                variant="subtle"
                size="1"
                tooltip={label}
                aria-label={label}
            />
            {name}
        </li>
    );
};
