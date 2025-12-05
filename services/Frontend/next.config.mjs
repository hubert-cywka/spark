import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    distDir: "./.next",
    basePath: "",
    serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
    turbopack: {
        root: "/"
    }
};

export default withNextIntl(nextConfig);
