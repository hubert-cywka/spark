import classNames from "clsx";
import { Link, Unlink } from "lucide-react";

import styles from "./styles/GoalLinkItem.module.scss";

import { IconButton } from "@/components/IconButton";

type GoalLinkItemProps = {
    linked?: boolean;
    onClick: () => void;
    name: string;
};

export const GoalLinkItem = ({ linked, onClick, name }: GoalLinkItemProps) => {
    return (
        <li className={styles.goal}>
            <IconButton
                className={classNames({ [styles.linkButton]: !linked }, { [styles.unlinkButton]: linked })}
                iconSlot={linked ? Unlink : Link}
                onPress={onClick}
                variant="subtle"
                size="1"
            />
            {name}
        </li>
    );
};
