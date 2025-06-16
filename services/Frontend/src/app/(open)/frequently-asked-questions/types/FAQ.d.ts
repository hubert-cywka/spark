export type FAQContentQuestion = {
    questionTranslationKey: string;
    answerTranslationKey: string;
};

export type FAQContentSection = {
    id: string;
    titleTranslationKey: string;
    questions: FAQContentQuestion[];
};
