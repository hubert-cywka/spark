export type TermsAndConditionsContentParagraph = {
    translationKey: string;
};

export type TermsAndConditionsContentSubsection = {
    id: string;
    titleTranslationKey: string;
    paragraphs: TermsAndConditionsContentParagraph[];
};

export type TermsAndConditionsContentSection = {
    id: string;
    titleTranslationKey: string;
    paragraphs: TermsAndConditionsContentParagraph[];
    subsections?: TermsAndConditionsContentSubsection[];
};
