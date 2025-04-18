import { AppRoute } from "@/app/appRoute";

export const getAbsoluteAppUrl = (route: AppRoute) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return baseUrl.concat(route);
};
