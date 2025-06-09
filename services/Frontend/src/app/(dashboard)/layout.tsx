import { PropsWithChildren } from "react";

import { DashboardProvider } from "@/app/(dashboard)/components/DashboardProvider/DashboardProvider.tsx";
import { DashboardShell } from "@/app/(dashboard)/components/DashboardShell/DashboardShell.tsx";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <DashboardProvider>
            <DashboardShell>{children}</DashboardShell>
        </DashboardProvider>
    );
}
