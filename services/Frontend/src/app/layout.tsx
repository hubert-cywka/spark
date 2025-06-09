import { PropsWithChildren } from "react";
import classNames from "clsx";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import "../styles/tokens.scss";
import "../styles/normalize.scss";
import styles from "./styles/Layout.module.scss";
import "react-loading-skeleton/dist/skeleton.css";

import { Provider } from "@/app/components/Provider/Provider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Spark",
    description: "",
};

export default async function RootLayout({ children }: PropsWithChildren) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={classNames(montserrat.className)} id="root">
                <NextIntlClientProvider messages={messages}>
                    <Provider>
                        <div className={styles.layout}>{children}</div>
                    </Provider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
