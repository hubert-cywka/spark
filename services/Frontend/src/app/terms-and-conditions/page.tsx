import "server-only";

import { TermsAndConditionsSection } from "@/app/terms-and-conditions/components/TermsAndConditionsSection/TermsAndConditionsSection.tsx";
import { TermsAndConditionsTableOfContents } from "@/app/terms-and-conditions/components/TermsAndConditionsTableOfContents/TermsAndConditionsTableOfContents.tsx";
import { TermsAndConditionsContentSection } from "@/app/terms-and-conditions/types/TermsAndConditions";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

// TODO: Replace with real content
const termsAndConditionsContent: TermsAndConditionsContentSection[] = [
    {
        id: "introduction",
        titleKey: "termsAndConditions.sections.introduction.title",
        paragraphs: [
            { key: "termsAndConditions.sections.introduction.paragraphs.p1" },
            { key: "termsAndConditions.sections.introduction.paragraphs.p2" },
        ],
        subsections: [
            {
                id: "service-provider",
                titleKey: "termsAndConditions.sections.introduction.subsections.serviceProvider.title",
                paragraphs: [
                    {
                        key: "termsAndConditions.sections.introduction.subsections.serviceProvider.paragraphs.p1",
                    },
                ],
            },
            {
                id: "age-requirements",
                titleKey: "termsAndConditions.sections.introduction.subsections.ageRequirements.title",
                paragraphs: [
                    {
                        key: "termsAndConditions.sections.introduction.subsections.ageRequirements.paragraphs.p1",
                    },
                ],
            },
        ],
    },
    {
        id: "service",
        titleKey: "termsAndConditions.sections.service.title",
        paragraphs: [{ key: "termsAndConditions.sections.service.paragraphs.p1" }],
        subsections: [
            {
                id: "service-options",
                titleKey: "termsAndConditions.sections.service.subsections.options.title",
                paragraphs: [
                    {
                        key: "termsAndConditions.sections.service.subsections.options.paragraphs.p1",
                    },
                ],
            },
            {
                id: "trials",
                titleKey: "termsAndConditions.sections.service.subsections.trials.title",
                paragraphs: [
                    {
                        key: "termsAndConditions.sections.service.subsections.trials.paragraphs.p1",
                    },
                ],
            },
        ],
    },
    {
        id: "using-service",
        titleKey: "termsAndConditions.sections.usingService.title",
        paragraphs: [{ key: "termsAndConditions.sections.usingService.paragraphs.p1" }],
        subsections: [
            {
                id: "account-creation",
                titleKey: "termsAndConditions.sections.usingService.subsections.accountCreation.title",
                paragraphs: [
                    {
                        key: "termsAndConditions.sections.usingService.subsections.accountCreation.paragraphs.p1",
                    },
                ],
            },
            {
                id: "your-rights",
                titleKey: "termsAndConditions.sections.usingService.subsections.yourRights.title",
                paragraphs: [
                    {
                        key: "termsAndConditions.sections.usingService.subsections.yourRights.paragraphs.p1",
                    },
                ],
            },
        ],
    },
    {
        id: "content-and-ip",
        titleKey: "termsAndConditions.sections.contentAndIP.title",
        paragraphs: [{ key: "termsAndConditions.sections.contentAndIP.paragraphs.p1" }],
        subsections: [
            {
                id: "user-content",
                titleKey: "termsAndConditions.sections.contentAndIP.subsections.userContent.title",
                paragraphs: [
                    {
                        key: "termsAndConditions.sections.contentAndIP.subsections.userContent.paragraphs.p1",
                    },
                ],
            },
        ],
    },
];

function Page() {
    const t = useTranslate();

    return (
        <Container>
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

export default Page;
