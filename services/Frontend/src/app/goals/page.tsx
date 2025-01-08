import "server-only";

import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { GoalsList } from "@/features/goals/components/GoalsList/GoalsList";

function Page() {
    return (
        <Container>
            <GoalsList />
        </Container>
    );
}

export default onlyAsAuthenticated(Page);
