import styles from "./styles/TermsAndConditionsSection.module.scss";

import { TermsAndConditionsSubSection } from "@/app/terms-and-conditions/components/TermsAndConditionsSubSection/TermsAndConditionsSubSection.tsx";
import { TermsAndConditionsContentSection } from "@/app/terms-and-conditions/types/TermsAndConditions";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type TermsAndConditionsSectionProps = {
    section: TermsAndConditionsContentSection;
    sectionIndex: number;
};

export const TermsAndConditionsSection = ({ section, sectionIndex }: TermsAndConditionsSectionProps) => {
    const t = useTranslate();

    return (
        <section id={section.id} key={section.id}>
            <h2 className={styles.header}>
                {sectionIndex + 1}. {t(section.titleKey)}
            </h2>

            {section.paragraphs.map((paragraph, pIndex) => (
                <p className={styles.paragraph} key={pIndex}>
                    {t(paragraph.key)}
                </p>
            ))}

            {!!section.subsections?.length && (
                <>
                    {section.subsections.map((subsection) => (
                        <TermsAndConditionsSubSection key={subsection.id} subsection={subsection} />
                    ))}
                </>
            )}
        </section>
    );
};
