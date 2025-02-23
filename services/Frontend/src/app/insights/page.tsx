import styles from "./styles/InsightsPage.module.scss";
import "server-only";

import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";

function Page() {
    return <Container className={styles.container}>Insights</Container>;
}

export default withSessionRestore(onlyAsAuthenticated(Page));
