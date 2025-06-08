import styles from "./styles/TermsAndConditionsSubSection.module.scss";

import { TermsAndConditionsContentSubsection } from "@/app/terms-and-conditions/types/TermsAndConditions";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type TermsAndConditionsSubSectionProps = {
    subsection: TermsAndConditionsContentSubsection;
};

export const TermsAndConditionsSubSection = ({ subsection }: TermsAndConditionsSubSectionProps) => {
    const t = useTranslate();

    return (
        <div key={subsection.id}>
            <h3 id={subsection.id} className={styles.header}>
                {t(subsection.titleTranslationKey)}
            </h3>

            {subsection.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className={styles.paragraph}>
                    {t(paragraph.translationKey)}
                </p>
            ))}
        </div>
    );
};
