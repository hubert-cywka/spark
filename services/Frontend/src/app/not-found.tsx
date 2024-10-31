import { redirect } from "next/navigation";

import { AppRoute } from "@/app/appRoute";

export default function Page() {
    redirect(AppRoute.HOME);
    return <div>404</div>;
}
