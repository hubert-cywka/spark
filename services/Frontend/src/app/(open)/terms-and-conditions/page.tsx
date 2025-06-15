import styles from "./styles/TermsAndConditionsPage.module.scss";
import "server-only";

import { TermsAndConditionsSection } from "@/app/(open)/terms-and-conditions/components/TermsAndConditionsSection/TermsAndConditionsSection.tsx";
import { TermsAndConditionsTableOfContents } from "@/app/(open)/terms-and-conditions/components/TermsAndConditionsTableOfContents/TermsAndConditionsTableOfContents.tsx";
import { TermsAndConditionsContentSection } from "@/app/(open)/terms-and-conditions/types/TermsAndConditions";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore.tsx";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <Container className={styles.container}>
            <Breadcrumbs items={[{ label: t("termsAndConditions.title") }]} />
            <TermsAndConditionsTableOfContents content={termsAndConditionsContent} />

            <main>
                {termsAndConditionsContent.map((section, sectionIndex) => (
                    <TermsAndConditionsSection key={section.id} section={section} sectionIndex={sectionIndex} />
                ))}
            </main>
        </Container>
    );
}

export default withSessionRestore(Page);

// TODO: Replace with real content
const termsAndConditionsContent: TermsAndConditionsContentSection[] = [
    {
        id: "introduction",
        titleTranslationKey: "termsAndConditions.sections.introduction.title",
        paragraphs: [
            {
                translationKey: "termsAndConditions.sections.introduction.paragraphs.p1",
            },
            {
                translationKey: "termsAndConditions.sections.introduction.paragraphs.p2",
            },
        ],
        subsections: [
            {
                id: "service-provider",
                titleTranslationKey: "termsAndConditions.sections.introduction.subsections.serviceProvider.title",
                paragraphs: [
                    {
                        translationKey: "termsAndConditions.sections.introduction.subsections.serviceProvider.paragraphs.p1",
                    },
                ],
            },
            {
                id: "age-requirements",
                titleTranslationKey: "termsAndConditions.sections.introduction.subsections.ageRequirements.title",
                paragraphs: [
                    {
                        translationKey: "termsAndConditions.sections.introduction.subsections.ageRequirements.paragraphs.p1",
                    },
                ],
            },
        ],
    },
    {
        id: "service",
        titleTranslationKey: "termsAndConditions.sections.service.title",
        paragraphs: [
            {
                translationKey: "termsAndConditions.sections.service.paragraphs.p1",
            },
        ],
        subsections: [
            {
                id: "service-options",
                titleTranslationKey: "termsAndConditions.sections.service.subsections.options.title",
                paragraphs: [
                    {
                        translationKey: "termsAndConditions.sections.service.subsections.options.paragraphs.p1",
                    },
                ],
            },
            {
                id: "trials",
                titleTranslationKey: "termsAndConditions.sections.service.subsections.trials.title",
                paragraphs: [
                    {
                        translationKey: "termsAndConditions.sections.service.subsections.trials.paragraphs.p1",
                    },
                ],
            },
        ],
    },
    {
        id: "using-service",
        titleTranslationKey: "termsAndConditions.sections.usingService.title",
        paragraphs: [
            {
                translationKey: "termsAndConditions.sections.usingService.paragraphs.p1",
            },
        ],
        subsections: [
            {
                id: "account-creation",
                titleTranslationKey: "termsAndConditions.sections.usingService.subsections.accountCreation.title",
                paragraphs: [
                    {
                        translationKey: "termsAndConditions.sections.usingService.subsections.accountCreation.paragraphs.p1",
                    },
                ],
            },
            {
                id: "your-rights",
                titleTranslationKey: "termsAndConditions.sections.usingService.subsections.yourRights.title",
                paragraphs: [
                    {
                        translationKey: "termsAndConditions.sections.usingService.subsections.yourRights.paragraphs.p1",
                    },
                ],
            },
        ],
    },
    {
        id: "content-and-ip",
        titleTranslationKey: "termsAndConditions.sections.contentAndIP.title",
        paragraphs: [
            {
                translationKey: "termsAndConditions.sections.contentAndIP.paragraphs.p1",
            },
        ],
        subsections: [
            {
                id: "user-content",
                titleTranslationKey: "termsAndConditions.sections.contentAndIP.subsections.userContent.title",
                paragraphs: [
                    {
                        translationKey: "termsAndConditions.sections.contentAndIP.subsections.userContent.paragraphs.p1",
                    },
                ],
            },
        ],
    },
];
