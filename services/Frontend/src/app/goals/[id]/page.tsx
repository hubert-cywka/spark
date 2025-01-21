import styles from "./styles/GoalPage.module.scss";
import "server-only";

import { Entries } from "@/app/goals/[id]/Entries";
import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";

async function Page({ params }: { params: Promise<{ id: string }> }) {
    const goalId = (await params).id;

    return (
        <Container className={styles.container}>
            <Entries goalId={goalId} />
        </Container>
    );
}

export default onlyAsAuthenticated(Page);
