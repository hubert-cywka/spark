import { useTranslations } from "next-intl";

import { FAQItem } from "./components/FAQItem";
import { FAQSection } from "./components/FAQSection";

import styles from "./styles/FAQPage.module.scss";
import "server-only";

import { Container } from "@/components/Container";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore.tsx";

function Page() {
    const t = useTranslations("faq");

    return (
        <Container className={styles.container}>
            <h1 className={styles.pageTitle}>{t("title")}</h1>

            <FAQSection title={t("sections.general.title")}>
                <FAQItem question={t("sections.general.questions.q1.question")}>
                    <p>{t("sections.general.questions.q1.answer")}</p>
                </FAQItem>
                <FAQItem question={t("sections.general.questions.q2.question")}>
                    <p>{t("sections.general.questions.q2.answer")}</p>
                </FAQItem>
                <FAQItem question={t("sections.general.questions.q3.question")}>
                    <p>{t("sections.general.questions.q3.answer")}</p>
                </FAQItem>
            </FAQSection>

            <FAQSection title={t("sections.account.title")}>
                <FAQItem question={t("sections.account.questions.q1.question")}>
                    <p>{t("sections.account.questions.q1.answer")}</p>
                </FAQItem>
                <FAQItem question={t("sections.account.questions.q2.question")}>
                    <p>{t("sections.account.questions.q2.answer")}</p>
                </FAQItem>
                <FAQItem question={t("sections.account.questions.q3.question")}>
                    <p>{t("sections.account.questions.q3.answer")}</p>
                </FAQItem>
            </FAQSection>

            <FAQSection title={t("sections.features.title")}>
                <FAQItem question={t("sections.features.questions.q1.question")}>
                    <p>{t("sections.features.questions.q1.answer")}</p>
                </FAQItem>
                <FAQItem question={t("sections.features.questions.q2.question")}>
                    <p>{t("sections.features.questions.q2.answer")}</p>
                </FAQItem>
                <FAQItem question={t("sections.features.questions.q3.question")}>
                    <p>{t("sections.features.questions.q3.answer")}</p>
                </FAQItem>
            </FAQSection>
        </Container>
    );
}

export default withSessionRestore(Page, { inBackground: true });
