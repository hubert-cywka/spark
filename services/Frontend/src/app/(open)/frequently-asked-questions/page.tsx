import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

import { FAQItem } from "./components/FAQItem";
import { FAQSection } from "./components/FAQSection";
import { FAQTableOfContents } from "./components/FAQTableOfContents/FAQTableOfContents";
import { FAQContentSection } from "./types/FAQ";

import styles from "./styles/FAQPage.module.scss";
import "server-only";

import { Container } from "@/components/Container";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore.tsx";
import { Breadcrumbs } from "@/components/Breadcrumbs";

function Page() {
    const t = useTranslate();

    return (
        <Container className={styles.container}>
            <Breadcrumbs items={[{ label: t("faq.title") }]} />
            <h1 className={styles.pageTitle}>{t("faq.title")}</h1>

            <FAQTableOfContents content={faqContent} />

            <main>
                {faqContent.map((section, sectionIndex) => (
                    <FAQSection key={section.id} section={section} sectionIndex={sectionIndex} />
                ))}
            </main>
        </Container>
    );
}

export default withSessionRestore(Page, { inBackground: true });

const faqContent: FAQContentSection[] = [
    {
        id: "general-questions",
        titleTranslationKey: "faq.sections.general.title",
        questions: [
            {
                questionTranslationKey: "faq.sections.general.questions.q1.question",
                answerTranslationKey: "faq.sections.general.questions.q1.answer",
            },
            {
                questionTranslationKey: "faq.sections.general.questions.q2.question",
                answerTranslationKey: "faq.sections.general.questions.q2.answer",
            },
            {
                questionTranslationKey: "faq.sections.general.questions.q3.question",
                answerTranslationKey: "faq.sections.general.questions.q3.answer",
            },
        ],
    },
    {
        id: "account-management",
        titleTranslationKey: "faq.sections.account.title",
        questions: [
            {
                questionTranslationKey: "faq.sections.account.questions.q1.question",
                answerTranslationKey: "faq.sections.account.questions.q1.answer",
            },
            {
                questionTranslationKey: "faq.sections.account.questions.q2.question",
                answerTranslationKey: "faq.sections.account.questions.q2.answer",
            },
            {
                questionTranslationKey: "faq.sections.account.questions.q3.question",
                answerTranslationKey: "faq.sections.account.questions.q3.answer",
            },
        ],
    },
    {
        id: "features-and-usage",
        titleTranslationKey: "faq.sections.features.title",
        questions: [
            {
                questionTranslationKey: "faq.sections.features.questions.q1.question",
                answerTranslationKey: "faq.sections.features.questions.q1.answer",
            },
            {
                questionTranslationKey: "faq.sections.features.questions.q2.question",
                answerTranslationKey: "faq.sections.features.questions.q2.answer",
            },
            {
                questionTranslationKey: "faq.sections.features.questions.q3.question",
                answerTranslationKey: "faq.sections.features.questions.q3.answer",
            },
        ],
    },
];
