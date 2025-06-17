import { Metadata } from "next";

import styles from "./styles/FAQPage.module.scss";
import "server-only";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore.tsx";
import { DocumentationContentSection, DocumentationSection, DocumentationTableOfContents } from "@/features/documentation";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const metadata: Metadata = {
    title: "Spark | FAQ",
    description: "",
};

function Page() {
    const t = useTranslate();

    return (
        <Container className={styles.container}>
            <Breadcrumbs items={[{ label: t("faq.title") }]} />
            <DocumentationTableOfContents content={faqContent} />
            <main>
                {faqContent.map((section, sectionIndex) => (
                    <DocumentationSection key={section.id} section={section} sectionIndex={sectionIndex} />
                ))}
            </main>
        </Container>
    );
}

export default withSessionRestore(Page, { inBackground: true });

// TODO: Replace with real content
const faqContent: DocumentationContentSection[] = [
    {
        id: "general-questions",
        titleTranslationKey: "faq.sections.general.title",
        paragraphs: [],
        subsections: [
            {
                id: "what-is-spark",
                titleTranslationKey: "faq.sections.general.questions.q1.question",
                paragraphs: [
                    {
                        translationKey: "faq.sections.general.questions.q1.answer",
                    },
                ],
            },
            {
                id: "is-spark-free",
                titleTranslationKey: "faq.sections.general.questions.q2.question",
                paragraphs: [
                    {
                        translationKey: "faq.sections.general.questions.q2.answer",
                    },
                ],
            },
            {
                id: "multiple-devices",
                titleTranslationKey: "faq.sections.general.questions.q3.question",
                paragraphs: [
                    {
                        translationKey: "faq.sections.general.questions.q3.answer",
                    },
                ],
            },
        ],
    },
    {
        id: "account-management",
        titleTranslationKey: "faq.sections.account.title",
        paragraphs: [],
        subsections: [
            {
                id: "how-to-create-account",
                titleTranslationKey: "faq.sections.account.questions.q1.question",
                paragraphs: [
                    {
                        translationKey: "faq.sections.account.questions.q1.answer",
                    },
                ],
            },
            {
                id: "how-to-reset-password",
                titleTranslationKey: "faq.sections.account.questions.q2.question",
                paragraphs: [
                    {
                        translationKey: "faq.sections.account.questions.q2.answer",
                    },
                ],
            },
            {
                id: "how-to-delete-account",
                titleTranslationKey: "faq.sections.account.questions.q3.question",
                paragraphs: [
                    {
                        translationKey: "faq.sections.account.questions.q3.answer",
                    },
                ],
            },
        ],
    },
    {
        id: "features-and-usage",
        titleTranslationKey: "faq.sections.features.title",
        paragraphs: [],
        subsections: [
            {
                id: "new-journal-entry",
                titleTranslationKey: "faq.sections.features.questions.q1.question",
                paragraphs: [
                    {
                        translationKey: "faq.sections.features.questions.q1.answer",
                    },
                ],
            },
            {
                id: "what-are-goals",
                titleTranslationKey: "faq.sections.features.questions.q2.question",
                paragraphs: [
                    {
                        translationKey: "faq.sections.features.questions.q2.answer",
                    },
                ],
            },
            {
                id: "what-kind-of-insights",
                titleTranslationKey: "faq.sections.features.questions.q3.question",
                paragraphs: [
                    {
                        translationKey: "faq.sections.features.questions.q3.answer",
                    },
                ],
            },
        ],
    },
];
