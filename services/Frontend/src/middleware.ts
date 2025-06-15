import { NextRequest, NextResponse } from "next/server";

import { buildCSPConfig } from "@/config/buildCSPConfig";

export const config = {
    matcher: [
        {
            source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);

    // Hubert: Add nonce for dynamic routes. Static routes work fine, due to workaround with build-time replacement
    // of inline scripts.
    const nonce = crypto.randomUUID();
    requestHeaders.set("x-nonce", nonce);

    const contentSecurityPolicyHeaderValue = buildCSPConfig(nonce);
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
    response.headers.set("Origin-Agent-Cluster", "?1");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
    response.headers.set("X-XSS-Protection", "0");

    return response;
}
