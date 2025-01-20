import styles from "./styles/GoalsPage.module.scss";
import "server-only";

import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { AddGoalPanel } from "@/features/goals/components/AddGoalPanel/AddGoalPanel";
import { GoalsDashboard } from "@/features/goals/components/GoalsDashboard";

function Page() {
    return (
        <Container className={styles.container}>
            <GoalsDashboard />

            <div className={styles.sidePanel}>
                <AddGoalPanel />
            </div>
        </Container>
    );
}

export default onlyAsAuthenticated(Page);
