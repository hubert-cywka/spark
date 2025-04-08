import clsx from "clsx";

import { SpinnerProps } from "./types/Spinner";

import styles from "./styles/Spinner.module.scss";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const Spinner = ({ size = "2", className }: SpinnerProps) => {
    const t = useTranslate();

    return <div className={clsx(styles.spinner, className)} data-size={size} role="progressbar" aria-label={t("common.loading")} />;
};
