import { PropsWithChildren } from "react";

import { Shell } from "@/app/components/Shell/Shell.tsx";

export default function Layout({ children }: PropsWithChildren) {
    return <Shell>{children}</Shell>;
}
