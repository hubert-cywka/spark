import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export const useTranslate = useTranslations;
export const getTranslationsAsync = getTranslations;
