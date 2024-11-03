import { IconNorthStar } from "@tabler/icons-react";
import clsx from "clsx";

import styles from "./styles/Logo.module.scss";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type LogoProps = { className?: string };

export const Logo = ({ className }: LogoProps) => {
    const t = useTranslate();

    return (
        <div className={clsx(styles.logo, className)}>
            <IconNorthStar />
            <span>{t("common.app.name")}</span>
        </div>
    );
};
