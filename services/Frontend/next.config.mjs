import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    distDir: "./.next",
    basePath: "",
    serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
    experimental: {
        sri: {
            algorithm: "sha256"
        }
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: buildCSPConfig(),
                    },
                ],
            },
        ]
    },
};

export default withNextIntl(nextConfig);

export const buildCSPConfig = () => {
    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    const cspHeader = `
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' ${apiURL};
    upgrade-insecure-requests;
`;
    return cspHeader.replace(/\s{2,}/g, " ").trim();
};
