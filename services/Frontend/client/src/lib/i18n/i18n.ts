import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import detector from "i18next-browser-languagedetector";

import { en } from "./translations/en";

i18next
    .use(initReactI18next)
    .use(detector)
    .init({
        react: {
            bindI18n: "loaded languageChanged",
            bindI18nStore: "added",
            useSuspense: true,
        },
        interpolation: {
            escapeValue: false,
        },
        fallbackLng: "EN",
        supportedLngs: ["EN"],
        resources: {
            EN: {
                translation: en,
            },
        },
    });

export const setLanguage = (language: string) => {
    return i18next.changeLanguage(language);
};

export const getLanguage = () => {
    return i18next.language;
};

export const i18n = i18next;
