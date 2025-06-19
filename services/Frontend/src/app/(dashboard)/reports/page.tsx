import "server-only";

import { Test } from "@/app/(dashboard)/reports/Test.tsx";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <Container>
            <Breadcrumbs items={[{ label: t("reports.navigation.label") }]} />
            <Test />
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
