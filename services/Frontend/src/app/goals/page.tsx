import "server-only";

import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { GoalsList } from "@/features/goals/components/GoalsList/GoalsList";

// TODO: Structure and style
function Page() {
    return (
        <div>
            <GoalsList />
        </div>
    );
}

export default onlyAsAuthenticated(Page);
