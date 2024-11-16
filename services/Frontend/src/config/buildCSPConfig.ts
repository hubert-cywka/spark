export const buildCSPConfig = () => {
    const isProd = process.env.NODE_ENV === "production";
    const apiURL = process.env.API_URL;

    const cspHeader = `
    default-src 'self';
    script-src 'self' ${isProd ? "" : "'unsafe-inline'"};
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
