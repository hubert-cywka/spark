import { PropsWithChildren } from "react";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import "../styles/tokens.scss";
import "../styles/normalize.scss";

import { Provider } from "@/app/Provider/Provider";
import { Shell } from "@/features/layout/components/Shell/Shell";

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
            <body className={montserrat.className}>
                <NextIntlClientProvider messages={messages}>
                    <Provider>
                        <Shell id="root">{children}</Shell>
                    </Provider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
