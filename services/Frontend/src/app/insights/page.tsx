import "server-only";

import { InsightsDashboard } from "@/app/insights/components/InsightsDasbhoard/InsightsDashboard";
import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";

function Page() {
    return (
        <Container>
            <InsightsDashboard />
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
