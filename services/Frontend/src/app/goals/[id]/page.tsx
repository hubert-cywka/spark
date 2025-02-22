import styles from "./styles/GoalPage.module.scss";
import "server-only";

import { GoalPageDashboard } from "@/app/goals/[id]/components/GoalPageDashboard";
import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";

async function Page({ params }: { params: Promise<{ id: string }> }) {
    const goalId = (await params).id;

    return (
        <Container className={styles.container}>
            <GoalPageDashboard goalId={goalId} />
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
