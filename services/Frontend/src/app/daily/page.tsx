import styles from "./styles/DailyPage.module.scss";
import "server-only";

import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { DailyList } from "@/features/daily/components/DailyList/DailyList";

function Page() {
    return (
        <Container className={styles.container}>
            <DailyList />
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
