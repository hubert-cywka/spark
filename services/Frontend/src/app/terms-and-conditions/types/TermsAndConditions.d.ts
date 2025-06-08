export type TermsAndConditionsContentParagraph = {
    key: string;
};

export type TermsAndConditionsContentSubsection = {
    id: string;
    titleKey: string;
    paragraphs: TermsAndConditionsContentParagraph[];
};

export type TermsAndConditionsContentSection = {
    id: string;
    titleKey: string;
    paragraphs: TermsAndConditionsContentParagraph[];
    subsections?: TermsAndConditionsContentSubsection[];
};
