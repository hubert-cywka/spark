import { PropsWithChildren } from "react";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import "../styles/design-tokens.scss";
import "../styles/normalize.scss";
import styles from "./layout.module.scss";

import { Provider } from "@/components/provider/Provider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Codename",
    description: "",
};

export default async function RootLayout({ children }: PropsWithChildren) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={montserrat.className}>
                <div id="root" className={styles.container}>
                    <NextIntlClientProvider messages={messages}>
                        <Provider>
                            <div className={styles.innerWrapper}>{children}</div>
                        </Provider>
                    </NextIntlClientProvider>
                </div>
            </body>
        </html>
    );
}
