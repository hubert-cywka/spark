import clsx from "clsx";
import { Flame } from "lucide-react";

import styles from "./styles/Logo.module.scss";

import { AppRoute } from "@/app/appRoute.ts";
import { Anchor } from "@/components/Anchor";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type LogoProps = { className?: string };

export const Logo = ({ className }: LogoProps) => {
    const t = useTranslate();

    return (
        <div className={clsx(styles.container, className)}>
            <Anchor href={AppRoute.HOME} className={styles.logo}>
                <Flame className={styles.icon} />
                <span className={styles.name}>{t("common.app.name")}</span>
            </Anchor>
        </div>
    );
};
