import "server-only";

import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { DailyList } from "@/features/daily/components/DailyList/DailyList";

function Page() {
    return (
        <Container>
            <DailyList />
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
