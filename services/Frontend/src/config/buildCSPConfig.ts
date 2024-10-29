export const buildCSPConfig = () => {
    const cspHeader = `
    default-src 'self';
    script-src 'self' ${process.env.NODE_ENV === "production" ? "" : "'unsafe-inline'"};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
    return cspHeader.replace(/\s{2,}/g, " ").trim();
};
