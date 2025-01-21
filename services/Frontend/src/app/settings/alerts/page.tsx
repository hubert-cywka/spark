import styles from "./styles/AlertsPage.module.scss";
import "server-only";

import { AppRoute } from "@/app/appRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
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
        </Container>
    );
}

export default onlyAsAuthenticated(Page);
