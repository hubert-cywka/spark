import styles from "./styles/AlertsPage.module.scss";
import "server-only";

import { AppRoute } from "@/app/appRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { AddDefaultReminderButton } from "@/features/alerts/components/AddDefaultReminderButton/AddDefaultReminderButton";
import { AlertsList } from "@/features/alerts/components/AlertsList/AlertsList";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <Container className={styles.container}>
            <Breadcrumbs
                items={[
                    {
                        label: t("settings.navigation.label"),
                        href: AppRoute.SETTINGS,
                    },
                    { label: t("settings.navigation.alerts.label") },
                ]}
            />
            <div className={styles.section}>
                <div className={styles.headerWrapper}>
                    <h2 className={styles.header}>{t("alerts.section.reminders.header")}</h2>
                    <AddDefaultReminderButton />
                </div>
                <p className={styles.description}>{t("alerts.section.reminders.description")}</p>
                <AlertsList />
            </div>
        </Container>
    );
}

export default onlyAsAuthenticated(Page);
