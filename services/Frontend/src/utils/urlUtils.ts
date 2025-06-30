import { AppRoute } from "@/app/appRoute";

const LINK_PATHNAME_TRUNCATE_LENGTH = 14;
const LINK_SEARCH_TRUNCATE_LENGTH = 10;
const ELLIPSIS = "⋯";
const ELLIPSIS_LENGTH = 1;

export function getAbsoluteAppUrl(route: AppRoute) {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return baseUrl.concat(route);
}

export function beautifyUrl(href: string) {
    try {
        const url = new URL(href);
        const protocol = beautifyProtocol(url.protocol);
        const hostname = beautifyHostname(url.hostname);
        const path = beautifyPath(url.pathname);
        const search = beautifySearch(url.search);
        return `${protocol}${hostname}${path}${search}`;
    } catch (error) {
        return href;
    }
}

function beautifyProtocol(protocol: string) {
    if (protocol === "https:") {
        return "";
    }
    return protocol + "//";
}

function beautifyHostname(hostname: string) {
    if (hostname.startsWith("www.")) {
        return hostname.substring(4);
    }
    return hostname;
}

function beautifyPath(path: string) {
    if (/^\/+$/.test(path)) {
        return "";
    }

    if (path.length < LINK_PATHNAME_TRUNCATE_LENGTH) {
        return path;
    }

    const pathParts = path.split("/").filter((part) => part.length > 0);
    const lastPart = pathParts[pathParts.length - 1];

    if (lastPart.length < LINK_PATHNAME_TRUNCATE_LENGTH && pathParts.length > 2) {
        return `/${ELLIPSIS}/${lastPart}`;
    }

    return `/${ELLIPSIS}${lastPart.substring(lastPart.length - LINK_PATHNAME_TRUNCATE_LENGTH + ELLIPSIS_LENGTH)}`;
}

function beautifySearch(rawSearch: string) {
    const search = rawSearch.replace(/^\?/, "");
    if (search.length === 0) {
        return "";
    }

    if (search.length < LINK_SEARCH_TRUNCATE_LENGTH) {
        return `?${search}`;
    }

    return `?${ELLIPSIS}${search.substring(search.length - LINK_SEARCH_TRUNCATE_LENGTH + ELLIPSIS_LENGTH)}`;
}
