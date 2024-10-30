import { getRequestConfig } from "next-intl/server";

import { defaultLocale } from "@/lib/i18n/config";

export default getRequestConfig(async () => {
    const locale = defaultLocale;
    const messages = (await import(`../../../translations/${locale}.json`)).default;

    return {
        locale,
        messages,
    };
});
