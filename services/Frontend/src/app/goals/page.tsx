import styles from "./styles/GoalsPage.module.scss";
import "server-only";

import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { AddGoalPanel } from "@/features/goals/components/AddGoalPanel/AddGoalPanel";
import { GoalsList } from "@/features/goals/components/GoalsList/GoalsList";

function Page() {
    return (
        <Container className={styles.container}>
            <GoalsList />

            <div className={styles.sidePanel}>
                <AddGoalPanel />
            </div>
        </Container>
    );
}

export default onlyAsAuthenticated(Page);
