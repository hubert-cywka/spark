import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { TranslationKey } from "../types/i18n";

export const useTranslate = () => {
    const { t } = useTranslation();

    return useCallback(
        (translationKey: TranslationKey, params?: Record<string, string | number>) => {
            return t(translationKey, params);
        },
        [t]
    );
};
