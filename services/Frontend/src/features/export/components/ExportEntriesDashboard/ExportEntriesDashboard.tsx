"use client";

import styles from "./styles/ExportEntriesDashboard.module.scss";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { ExportEntriesList } from "@/features/export/components/ExportEntriesList/ExportEntriesList.tsx";
import { ExportEntriesListSkeleton } from "@/features/export/components/ExportEntriesList/ExportEntriesListSkeleton.tsx";
import { StartExportModal } from "@/features/export/components/StartExportModal/StartExportModal.tsx";
import { useRecentDataExportEntries } from "@/features/export/hooks/useRecentDataExportEntries.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const ExportEntriesDashboard = () => {
    const t = useTranslate();

    const { data: exportEntries, isLoading, isError } = useRecentDataExportEntries();
    const isAnotherExportActive = isLoading || !!exportEntries?.find((entry) => entry.status === "pending");

    return (
        <article className={styles.container}>
            {isLoading && <ExportEntriesListSkeleton />}

            {isError && !!exportEntries?.length && <Alert variant="danger">{t("exports.list.error")}</Alert>}

            {!isLoading && !isError && !exportEntries?.length && <Alert variant="info">{t("exports.list.noData")}</Alert>}

            {!isLoading && !!exportEntries?.length && (
                <>
                    <p>{t("exports.list.header")}</p>
                    <ExportEntriesList entries={exportEntries} />
                </>
            )}

            <StartExportModal
                trigger={({ onClick }) => (
                    <Button onClick={onClick} isDisabled={isAnotherExportActive}>
                        {t("exports.list.buttons.start.label")}
                    </Button>
                )}
            />
        </article>
    );
};
