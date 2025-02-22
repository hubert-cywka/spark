import styles from "./styles/GoalsPage.module.scss";
import "server-only";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { AddGoalPanel } from "@/features/goals/components/AddGoalPanel/AddGoalPanel";
import { GoalsDashboard } from "@/features/goals/components/GoalsDashboard";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <Container className={styles.container}>
            <Breadcrumbs items={[{ label: t("goal.navigation.goals.label") }]} />
            <div className={styles.dashboardWrapper}>
                <GoalsDashboard />

                <div className={styles.sidePanel}>
                    <AddGoalPanel />
                </div>
            </div>
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
