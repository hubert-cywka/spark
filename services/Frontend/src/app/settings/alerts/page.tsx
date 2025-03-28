import styles from "./styles/AlertsPage.module.scss";
import "server-only";

import { AppRoute } from "@/app/appRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { AlertsList } from "@/features/alerts/components/AlertsList/AlertsList";
import { AddDefaultReminderButton, ReminderCard } from "@/features/alerts/components/reminders";
import { getLimitOfReminders } from "@/features/alerts/domain/rules.ts";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <Container>
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
                <h2 className={styles.header}>{t("alerts.reminders.header")}</h2>
                <p className={styles.description}>{t("alerts.reminders.description")}</p>

                <AlertsList
                    maxAlertsAllowed={getLimitOfReminders()}
                    onAddAlertRender={AddDefaultReminderButton}
                    onAlertRender={ReminderCard}
                />
            </div>
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
